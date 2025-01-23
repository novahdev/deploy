import { AppSession, Authenticated, AuthGuard } from '@deploy/api/auth';
import { IProject, ProjectPipe, ProjectsService } from '@deploy/api/models/projects';
import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectCreateDto } from './dto';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { Pm2Process, Pm2Service } from '@deploy/api/common/pm2';
import { isApplicationOnline } from '@deploy/api/utils';
import { ApiProjectRaw } from '@deploy/schemas/projects';
import { join } from 'path';
import { existsSync } from 'fs';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly _projects: ProjectsService,
        private readonly _pm2: Pm2Service
    ){}

    public parseData(data: IProject): ApiProjectRaw {
        return {
            id: data.id,
            created_at: data.createdAt.toISOString(),
            updated_at: data.updatedAt.toISOString(),
            deploy_at: data.deployAt?.toISOString() ?? null,
            status: data.status,
            is_online: data.isOnline,
            domain: data.domain,
            name: data.name,
            process_name: data.processName,
            version: data.version,
            location: data.location,
            startup_file: data.startupFile,
            framework: data.framework,
            running_on: data.runningOn,
            runtime_environment: data.runtimeEnvironment,
            url: data.url,
            repository: data.repository,
            env: data.env,
            ignore: data.ignore,
            observation: data.observation,
            permissions: data.permissions,
        }
    }

    public async nameAndProcessNameAvailable(data: { name: { domain:string, value: string }, processName?: string, ignore?: string }) {
        const [nameValid, processNameValid] = await  Promise.all([
            data.name ? this._projects.isAvailableName(data.name.value, data.name.domain, data.ignore) : true,
            data.processName ? this._projects.isAvailableProcessName(data.processName, data.ignore) : true
        ]);

        if (!nameValid || !processNameValid){
            const details: string[] = [];
            let message = "";
            
            if (!nameValid && !processNameValid){
                details.push(`El nombre "${data.name.value}" ya esta en uso para el dominio "${data.name.domain}".`);
                details.push(`El nombre "${data.processName}" ya esta en uso para el proceso.`);
                message = "El nombre del proyecto o del proceso ya esta en uso.";
            } else {
                if (!nameValid){
                    details.push(`El nombre "${data.name}" ya esta en uso para el dominio.`);
                    message = "El nombre del proceso ya esta en uso.";
                } else {
                    details.push(`El nombre "${data.processName}" ya esta en uso para el proceso.`);
                    message = "El nombre del proyecto ya esta en uso.";
                }
            }

            throw new HttpException({ message, details } , 400);
        }
    }

    @Get()
    async getProjects(@Authenticated() session: AppSession) {
        let data: IProject[];
        const pm2Processes: Pm2Process[] = this._pm2.getAll();

        if (session.role === "admin"){
            data = await this._projects.getAll();
        } else {
            data = await this._projects.getAll({ userId: session.id });
        }

        const list = await Promise.all(data.map(async x => {
            const project = this.parseData(x);
            if (project.running_on === "PM2"){
                const res = pm2Processes.find(y => y.name === x.processName)?.pm2_env.status || "stopped";
                if (res === "online"){
                    project.status = "running";
                }
            } else {
                if (project.framework === "Angular"){
                    project.status = "running";
                }
            }

            if (project.url){
                project.is_online = await isApplicationOnline(project.url);
            }            
            return project
        }))

        return {
            data: list
        }
    }

    @Post()
    async createProject(@Authenticated() session: AppSession, @Body() body: ProjectCreateDto) {

        if (session.role !== "admin"){
            throw new HttpException("No tienes permisos para crear un proyecto", 403);
        }

        await this.nameAndProcessNameAvailable({ name: { domain: body.domain, value: body.name }, processName: body.processName });
        
        return {
            data: this.parseData(await this._projects.create(body))
        }
    }

    @Put(":id")
    async updateProject(@Authenticated() session: AppSession, @Param("id", ProjectPipe) project: IProject, @Body() body: ProjectUpdateDto) {
        if (session.role !== "admin"){
            throw new HttpException("No tienes permisos para actualizar el proyecto", 403);
        }

        await this.nameAndProcessNameAvailable({ name: { domain: body.domain ?? project.domain, value: body.name ?? project.name }, processName: body.processName, ignore: project.id });

        await this._projects.update(project.id, body);
        return {
            data: null
        }
    }

    @Delete(":id")
    async deleteProject(@Authenticated() session: AppSession, @Param(":id", ProjectPipe) project: IProject) {
        if (session.role !== "admin"){
            throw new HttpException("No tienes permisos para eliminar el proyecto", 403);
        }

        await this._projects.delete(project.id);
        return {
            message: "Proyecto eliminado."
        }
    }

    @Post(":id/run")
    async runProject(@Authenticated() session: AppSession, @Param("id", ProjectPipe) project: IProject) {
        if (session.role !== "admin"){
            throw new HttpException("No tienes permisos para ejecutar el proyecto", 403);
        }

        if (project.runningOn === "PM2"){
            if (!this._pm2.installed()){
                throw new HttpException("PM2 no esta instalado en el servidor.", 500);
            }
            const startupFilePath = join(project.location, project.startupFile);
            if (!existsSync(startupFilePath)){
                throw new HttpException({ 
                    message: "El archivo de inicio no existe.",
                    details: [ `El archivo "${startupFilePath}" no existe.`]
                }, 500);
            }

            const process = this._pm2.getAll().find(x => x.name === project.processName);
            if (process){
                if (process.pm2_env.status === "online"){
                    throw new HttpException("El proceso ya esta en ejecución.", 400);
                }
            } else {
                this._pm2.start(project.location, project.startupFile, project.processName, project.env);
            }

            const status = this._pm2.get(project.processName)?.pm2_env.status;
            const isOnline = project.url ? await isApplicationOnline(project.url) : false;

            return {
                message: status === "online" ? "Proyecto en ejecución." : "Proyecto en cola.",
                data: {
                    status,
                    is_online: isOnline
                }
            }
        } else if (project.runningOn === null) {
            return {
                message: "Proyecto en ejecución."
            }
        }
        throw new HttpException(`No hay soporte para aplicaciones ejecutadas en ${project.runningOn}.`, 500);
    }

    @Post(":id/stop")
    async stopProject(@Authenticated() session: AppSession, @Param("id", ProjectPipe) project: IProject) {
        if (session.role !== "admin"){
            throw new HttpException("No tienes permisos para detener el proyecto", 403);
        }

        if (project.runningOn === "PM2"){
            if (!this._pm2.installed()){
                throw new HttpException("PM2 no esta instalado en el servidor.", 500);
            }
            const process = this._pm2.getAll().find(x => x.name === project.processName);
            if (process){
                if (process.pm2_env.status === "online"){
                    this._pm2.stop(project.processName);
                    return {
                        message: "Proyecto detenido."
                    }
                }
                throw new HttpException("El proceso no esta en ejecución.", 400);
            }
            throw new HttpException("El proceso no existe.", 400);
        } else if (project.runningOn === null) {
            throw new HttpException("El proyecto no se puede detener.", 400);
        }
        throw new HttpException(`No hay soporte para aplicaciones ejecutadas en ${project.runningOn}.`, 500);
    }
}
