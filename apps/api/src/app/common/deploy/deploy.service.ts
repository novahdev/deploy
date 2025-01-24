import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { HttpException, Injectable } from '@nestjs/common';
import { clearDir, compareDependencies } from '@deploy/api/utils';
import extractZip from 'extract-zip';
import { execSync } from 'node:child_process';
import { Pm2Service } from '../pm2';
import { join } from 'node:path';

type DeployAngularConfig = {
    startupFile: string,
    location: string,
    buffer: Buffer,
    ignore: string[],
    omitVersionCheck?: boolean,
    pm2?: {
        processName: string,
        env: { [key: string]: string }
    }
}
type DeployNestConfig = {
    startupFile: string,
    location: string,
    buffer: Buffer,
    ignore: string[],
    omitVersionCheck?: boolean,
    pm2?: {
        processName: string,
        env: { [key: string]: string }
    }
}
interface PackageJson {
    version: string;
    dependencies?: { [key: string]: string };
    devDependencies?: { [key: string]: string };
  }

  
@Injectable()
export class DeployService {

    constructor(
        private readonly _pm2: Pm2Service
    ){}

    
    private async extractZip(location: string, buffer: Buffer): Promise<void> {
        const name = `temp-${crypto.randomUUID()}.zip`;
        writeFileSync(name, buffer);
        await extractZip(name, { dir: location });
        rmSync(name);
    }
    
    public async deployAngular(config: DeployAngularConfig): Promise<"running" | "error"> {
        clearDir(config.location, config.ignore);
        await this.extractZip(config.location, config.buffer);
        if (config.pm2){
            const process = this._pm2.get(config.pm2.processName);
            if (process){
                this._pm2.reload(config.pm2.processName, config.location, config.pm2.env);
            } else {
                this._pm2.start(config.location, config.startupFile, config.pm2.processName, config.pm2.env);
            }
            return this._pm2.get(config.pm2.processName)?.pm2_env.status == "online" ? "running" : "error";
        }
        return "running";
    }

    public async deployNest(config: DeployNestConfig){
        const packageJsonOld: PackageJson = JSON.parse(readFileSync(`${config.location}/package.json`).toString());
        if (config.pm2){
            config.ignore.push("node_modules");
            config.ignore.push(".env");
            clearDir(config.location, config.ignore);
            await this.extractZip(config.location, config.buffer);
            const packageJsonNew: PackageJson = JSON.parse(readFileSync(`${config.location}/package.json`).toString());

            if (!config.omitVersionCheck){
                if (packageJsonOld.version == packageJsonNew.version){
                    throw new HttpException("La versión del paquete es la misma", 400);
                }
            }
            
            // Verificar si hay cambios en las dependencias para ejecutar npm install
            if (compareDependencies(packageJsonOld.dependencies ?? {}, packageJsonNew.dependencies ?? {}).length > 0){
                execSync('npm i --omit=dev', { cwd:  config.location  });
            }

            if (!existsSync(join(config.location, config.startupFile))){
                throw new HttpException({
                    message: "No se encontró el archivo de inicio",

                }, 500);
            }
            
            if (config.pm2){
                const process = this._pm2.get(config.pm2.processName);
                if (process){
                    this._pm2.reload(config.pm2.processName, config.location, config.pm2.env);
                } else {
                    this._pm2.start(config.location, config.startupFile, config.pm2.processName, config.pm2.env);
                }
                return this._pm2.get(config.pm2.processName)?.pm2_env.status == "online" ? "running" : "error";
            }
            return "running";
        }
        throw new HttpException("Soy hay soporte para desplegar con PM2", 400);
    }
}
