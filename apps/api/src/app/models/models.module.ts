import { Global, Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { TokensService } from './tokens/tokens.service';

@Global()
@Module({
  providers: [UsersService, TokensService],
  exports: [UsersService]
})
export class ModelsModule {}
