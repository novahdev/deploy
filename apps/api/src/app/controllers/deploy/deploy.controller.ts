import { Body, Controller, FileTypeValidator, HttpException, ParseBoolPipe, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppSession, Authenticated, AuthGuard } from '@deploy/api/auth';
import { IProject, ProjectPipe, ProjectsService } from '@deploy/api/models/projects';
import { DeployService } from '@deploy/api/common/deploy';

@UseGuards(AuthGuard)
@Controller('deploy')
export class DeployController {
    constructor(
        private readonly _projects: ProjectsService,
        private readonly _deploy: DeployService
    ) { }


    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public async deployProject(
        @Authenticated()
        session: AppSession,
        @Body("project", ProjectPipe)
        project: IProject,
        @UploadedFile(new ParseFilePipe({ validators: [  new FileTypeValidator({ fileType: 'zip' }) ]}))
        file: Express.Multer.File,
        @Query("omit-version-changes", new ParseBoolPipe({ optional: true })) omitVersionCheck?: boolean
    ): Promise<{
        message: string,
        data: {
            status: string
        }
    }> {

        if (session.role !== "admin"){
            const permissions = await this._projects.getPermissions(project.id, session.id);
            if (!permissions.includes("deploy")){
                throw new HttpException("No tienes permisos para desplegar este proyecto", 403);
            }
        }

        if (project.framework == "Angular"){
            const status = await this._deploy.deployAngular({
                buffer: file.buffer,
                ignore: project.ignore,
                location: project.location,
                startupFile: project.startupFile,
                omitVersionCheck,
                pm2: project.runningOn == "PM2" ? { processName: project.processName, env: project.env } : undefined
            });
            return {
                message: "Proyecto desplegado correctamente",
                data: {
                    status
                }
            }
        } else if (project.framework == "NestJS"){

            const status = await this._deploy.deployNest({
                buffer: file.buffer,
                ignore: project.ignore,
                location: project.location,
                startupFile: project.startupFile,
                omitVersionCheck,
                pm2: project.runningOn == "PM2" ? { processName: project.processName, env: project.env } : undefined
            })
            return {
                message: "Proyecto desplegado correctamente",
                data: {
                    status
                }
            }
        } else if (project.framework == "FastAPI"){
            throw new HttpException("Framework no soportado", 400);
        } else if (project.framework === null){
            return { message: "No se cargo el proyecto", data: { status: "running" } }
        } else {
            throw new HttpException("Framework no soportado", 400);
        }
    } 
}
