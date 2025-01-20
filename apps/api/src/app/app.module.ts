import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@deploy/api/config';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
