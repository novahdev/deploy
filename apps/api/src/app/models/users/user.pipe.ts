import { HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { UsersService } from './users.service';

@Injectable()
export class UserPipe implements PipeTransform {
  constructor(private readonly _users: UsersService){}
  async transform(value: unknown) {
    if (typeof value === "string" && isUUID(value)){
      const user = await this._users.get(value);
      if (!user) throw new HttpException("Usuario no encontrado", 404);
      return user;
    }
    throw new HttpException("El formato del parámetro es incorrecto", 400);
  }
}
