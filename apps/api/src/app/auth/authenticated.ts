import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core'
import { UsersService } from '../models/users';
import { AppModule } from '../app.module';
import { AppSession } from './app-session';

export const Authenticated = createParamDecorator(
    async (data: "user" | "token" | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request&{ appToken: AppSession }>();
        if (!(request.appToken instanceof AppSession)){
            throw new HttpException('No se cargo correctamente la información de la sesión.', 500);
        }

        if (data == "user"){
            const appContext = await NestFactory.createApplicationContext(AppModule);
            const userService = appContext.get(UsersService);
            const user =  await userService.get(request.appToken.id);
            if (!user){
                throw new HttpException({ 
                    message: "No se pudo obtener la información de usuario del token."
                }, 500)
            }
            return user;
        }

        return request.appToken;
    },
);