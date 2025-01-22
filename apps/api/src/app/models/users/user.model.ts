import { IUserPlaintData } from "./user.interface";
import { UsersService } from "./users.service";
import { definePropertiesOnObject } from '@deploy/core/utils/define-properties-on-object';

export class User {
    private _service: UsersService;
    public readonly id: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly role: "admin" | "collaborator";
    public readonly name: string;
    public readonly email: string;
    public readonly password: string;

    constructor(data: IUserPlaintData, service: UsersService){
        this._service = service;
        this.id = data.id;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = new Date(data.updatedAt);
        this.role = data.role;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;

    }

    public async update(data: { name: string, email: string, password: string }): Promise<void> {
        const res = await this._service.update(this.id, data);
        definePropertiesOnObject(this, res);
    }

    public async destroy(): Promise<void> {
        await this._service.delete(this.id);
    }
}