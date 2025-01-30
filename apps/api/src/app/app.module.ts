import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { ConfigModule } from '@deploy/api/config';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';
import { CommonModule } from './common/common.module';
import { ControllersModule } from './controllers/controllers.module';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule,
    ModelsModule,
    CommonModule, ControllersModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.NODE_ENV === "development" ? join(__dirname, '../panel/browser') : join('./public/browser'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
