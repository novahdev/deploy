import { Admin, AppSession, Authenticated, AuthGuard } from '@deploy/api/auth';
import { UserPipe, UsersService, User } from '@deploy/api/models/users';
import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiUsersResponse } from '@deploy/schemas/api';
import { capitalize } from '@deploy/core/utils/capitalize';

@UseGuards(AuthGuard)
@Admin()
@Controller('users')
export class UsersController {
    constructor(private readonly _users: UsersService){}

    @Get()
    async getAll(@Authenticated() session: AppSession): Promise<ApiUsersResponse>{
        const users = await this._users.getAll({ ignore: session.id });

        return {
            data: users.map(user => ({
                id: user.id,
                created_at: user.createdAt,
                role: user.role,
                name: user.name,
                email: user.email
            }))
        }
    }

    @Get(":id")
    async get(@Param("id") id: string){
        const user = await this._users.get(id);
        if (!user){
            throw new HttpException("Usuario no encontrado.", 404);
        }

        return {
            data: {
                id: user.id,
                createdAt: user.createdAt,
                role: user.role,
                name: user.name,
                email: user.email
            }
        }
    }

    @Post()
    async create(@Body() body: CreateUserDto): Promise<{ data: { id: string, name: string, email: string } }> {
        if (!(await this._users.emailAvailable(body.email))){
            throw new HttpException("El correo ya esta en uso.", 400);
        }
        const user = await  this._users.create({
            role: "collaborator",
            name: capitalize(body.name),
            email: body.email,
            password: body.password
        });

        return {
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }

    @Put(":id")
    async update(@Param("id", UserPipe) user: User, @Body() body: UpdateUserDto): Promise<void> {
        if (Object.keys(body).length == 0){
            throw new HttpException("Se debe ingresar por lo menos un valor a modificar.", 400);
        }
        await this._users.update(user.id, body);
    }

    @Delete(":id")
    async delete(@Param("id", UserPipe) user: User): Promise<void> {
        await user.destroy();
        return;
    }
}
