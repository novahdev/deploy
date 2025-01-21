import { Global, Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { TokensService } from './tokens/tokens.service';
import { ProjectsService } from './projects/projects.service';

@Global()
@Module({
  providers: [UsersService, TokensService, ProjectsService],
  exports: [UsersService, TokensService, ProjectsService]
})
export class ModelsModule {}
