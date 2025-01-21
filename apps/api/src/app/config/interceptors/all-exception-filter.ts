import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '../config.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  constructor(private _config: ConfigService){}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const error: { code?: '', message?: string, details?: string[] } =  {}

    if (exception instanceof HttpException){
      const res = exception.getResponse();
      if (typeof res === "string"){
        error.message = exception.message;
      } else {
        error.code = res["code"];
        error.message = exception.message;
      }
    } else if (exception instanceof Error) {
      error.message = exception.message;
    }
    

    response.status(status).json({
      version: this._config.version,
      status_code: status,
      message: exception instanceof HttpException ? exception.message : 'Internal server error',
      error: error,
      support: {
        email: "support.deploy@novah.dev",
        homepage: "https://deploy.novah.dev/support"
      }
    });
  }
}