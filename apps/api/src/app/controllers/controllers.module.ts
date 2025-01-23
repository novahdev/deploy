import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { ProfileController } from './profile/profile.controller';
import { ProjectsController } from './projects/projects.controller';

@Module({
  controllers: [AuthController, UsersController, ProfileController, ProjectsController]
})
export class ControllersModule {}
