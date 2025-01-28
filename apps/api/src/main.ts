/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ResponseInterceptor } from '@deploy/api/config';
import { ConfigService, initDb } from '@deploy/api/config';
import { AllExceptionsFilter } from './app/config/interceptors/all-exception-filter';

async function bootstrap() {

  try{
    await initDb()
  } catch(error){
    Logger.error(`[APP] No se cargar la base de datos: ${ error.message }`);
    process.exit(1);
  }

  const version = JSON.parse(readFileSync(join("package.json"), 'utf-8')).version;
  process.env.VERSION = version;
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.useGlobalFilters(new AllExceptionsFilter(app.get(ConfigService)));
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(ConfigService)));
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const port = process.env.PORT || 2025;
  await app.listen(port);
  Logger.log(
    `🚀 Application v${version} is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
