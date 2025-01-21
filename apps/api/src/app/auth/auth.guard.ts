import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { isUUID } from 'class-validator';
import { getService } from '@deploy/api/utils';
import { TokensService } from '@deploy/api/models/tokens';
import { AppSession } from './app-session';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token = request.headers["x-app-token"];
    const type = request.headers["x-app-type"] ?? null;
    const tokensService = await getService(TokensService);

    
    if (typeof token !== "string" || !isUUID(token)){
      throw new HttpException("Formato del token invalido", 401);
    }

    const tokenAuth = await tokensService.verify(token);

    if (!tokenAuth){
      throw new HttpException("Token invalido", 401);
    }

    if (tokenAuth.exp && tokenAuth.exp < (new Date())){
      throw new HttpException("El token de acceso ha expirado", 401);
    }

    request["appToken"] = new AppSession({ ...tokenAuth, token, type: type == "cli" ? "cli" : "web" });

    return true;
  }
}
