import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { isUUID } from 'class-validator';
import { getService } from '@deploy/api/utils';
import { TokensService } from '@deploy/api/models/tokens';
import { AppSession } from './app-session';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly _reflector: Reflector
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token = request.headers["x-app-token"];
    const type = request.headers["x-app-type"] ?? null;
    const tokensService = await getService(TokensService);
    
    if (typeof token !== "string" || !isUUID(token)){
      throw new HttpException(!token ? "Se requiere autenticación" : "Formato del token invalido", 401);
    }

    const tokenAuth = await tokensService.verify(token);

    if (!tokenAuth){
      throw new HttpException("Token invalido", 401);
    }

    if (tokenAuth.exp && tokenAuth.exp < (new Date())){
      throw new HttpException("El token de acceso ha expirado", 401);
    }

    request["appToken"] = new AppSession({ ...tokenAuth, token, type: type == "cli" ? "cli" : "web" });

    const isAdmin: boolean | undefined = this._reflector.getAllAndOverride<boolean>('isAdmin', [context.getHandler(), context.getClass()]);

    if (isAdmin){
      if (request["appToken"].role !== "admin"){
        throw new HttpException("No tienes permisos para acceder a este recurso", 403);
      }
    }

    return true;
  }
}
