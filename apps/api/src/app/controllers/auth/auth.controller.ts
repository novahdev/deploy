import { UsersService } from '@deploy/api/models/users';
import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CredentialsDto } from './dto';

@Controller()
export class AuthController {
    constructor(private readonly _users: UsersService) {}

    @Post("sign-in")
    async singIn(@Body() credentials: CredentialsDto) {
        // throw new Error("Method not implemented.");
        // throw new HttpException({ message: "Method not implemented.", code: 401 }, 400);
        const user = await this._users.get(credentials.username);
        if (!user) {
            throw new HttpException({ message: "Usuario no encontrado.", code: 1 }, 400)
        }
    }
}
