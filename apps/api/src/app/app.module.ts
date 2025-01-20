import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@deploy/api/config';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [ConfigModule, ModelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
