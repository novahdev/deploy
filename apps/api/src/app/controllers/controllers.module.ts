import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';

@Module({
  controllers: [AuthController, UsersController]
})
export class ControllersModule {}
