import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {

  constructor(private readonly _config: ConfigService){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map(data => ({
        version: this._config.version ?? "0.0.0",
        status_code: statusCode,
        ...data,
        support: {
          email: "soporte.deploy@novah.dev",
        homepage: "https://deploy.novah.dev/support",
        }
      })
    ));
  }
}
