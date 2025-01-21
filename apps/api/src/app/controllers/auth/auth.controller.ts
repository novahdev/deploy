import { UsersService } from '@deploy/api/models/users';
import { Body, Controller, Headers, HttpException, Ip, Post } from '@nestjs/common';
import { CredentialsDto } from './dto';
import { verify } from 'argon2';
import { UAParser } from 'ua-parser-js';
import { TokensService } from '@deploy/api/models/tokens';

@Controller()
export class AuthController {
    constructor(private readonly _users: UsersService, private readonly _tokens: TokensService) {}

    @Post("sign-in")
    async singIn(@Body() credentials: CredentialsDto,@Ip() ip: string, @Headers("user-agent") userAgentString: string, @Headers("x-app-hostname") hostname?: string) {
        const user = await this._users.get(credentials.username);
        if (!user) {
            throw new HttpException({ message: "Usuario no encontrado.", code: 1 }, 400)
        }

        if (!await verify(user.password, credentials.password)){
            throw new HttpException("Contraseña incorrecta.", 400);
        }

        const userAgent = new UAParser(userAgentString);
        let exp: Date | null = null;
        const cli = userAgent.getBrowser().name ? false : true;

        if (!cli){
            exp = new Date();
            exp.setHours(exp.getHours() + 8);
        }

        const token = await this._tokens.create({
            userId: user.id,
            type: cli ? "cli" : "web",
            device: userAgent.getDevice().type ?? "desktop",
            ip,
            exp,
            hostname: hostname ?? "website",
            platform: userAgent.getOS().name ?? null
        })

        return {
            data: {
                role: user.role,
                name: user.name,
                token: token.id
            }
        }
    }
}
