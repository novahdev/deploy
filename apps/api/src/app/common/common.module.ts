import { Global, Module } from '@nestjs/common';
import { DbService } from './db/db.service';
import { Pm2Service } from './pm2/pm2.service';
import { DeployService } from './deploy/deploy.service';

@Global()
@Module({
  providers: [DbService, Pm2Service, DeployService],
  exports: [DbService, Pm2Service, DeployService]
})
export class CommonModule {}
