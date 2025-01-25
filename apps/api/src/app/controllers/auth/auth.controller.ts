import { Body, Controller, Headers, HttpException, Ip, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '@deploy/api/models/users';
import { TokensService } from '@deploy/api/models/tokens';
import { AppSession, Authenticated, AuthGuard } from '@deploy/api/auth';
import { verify } from 'argon2';
import { UAParser } from 'ua-parser-js';
import { CredentialsDto } from './dto';

@Controller()
export class AuthController {
    constructor(private readonly _users: UsersService, private readonly _tokens: TokensService) {}

    @Post("sign-in")
    async singIn(@Body() credentials: CredentialsDto,@Ip() ip: string, @Headers("user-agent") userAgentString: string, @Headers("x-app-hostname") hostname?: string) {
        const user = await this._users.get(credentials.username);
        const userAgent = new UAParser(userAgentString);
        const device = userAgent.getDevice().type ?? "desktop";

        if (!['mobile', 'tablet', 'desktop'].includes(device)){
            throw new HttpException("Dispositivos no permitidos", 400);
        }

        if (!user) {
            throw new HttpException({ message: "Usuario no encontrado.", code: 1 }, 400)
        }

        if (!await verify(user.password, credentials.password)){
            throw new HttpException("Contraseña incorrecta.", 400);
        }

        let exp: Date | null = null;
        const cli = userAgent.getBrowser().name ? false : true;

        if (!cli){
            exp = new Date();
            exp.setHours(exp.getHours() + 8);
        }

        const token = await this._tokens.create({
            userId: user.id,
            type: cli ? "cli" : "web",
            device: device as "desktop" | "mobile" | "tablet",
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

    @UseGuards(AuthGuard)
    @Post("keep-session-open")
    async keepSessionOpen(@Authenticated() session: AppSession){
        await session.keepSessionOpen();
    }
    
    @UseGuards(AuthGuard)
    @Post("logout")
    async logout(@Authenticated() session: AppSession){
        await session.logout();
    }
}
