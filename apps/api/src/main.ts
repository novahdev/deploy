/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 2025;
  process.env.VERSION = JSON.parse(readFileSync(join("package.json"), 'utf-8')).version;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
