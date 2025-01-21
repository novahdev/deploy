import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@deploy/api/config';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';
import { CommonModule } from './common/common.module';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  imports: [ConfigModule, ModelsModule, CommonModule, ControllersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
