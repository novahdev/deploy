import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { ProfileController } from './profile/profile.controller';

@Module({
  controllers: [AuthController, UsersController, ProfileController]
})
export class ControllersModule {}
