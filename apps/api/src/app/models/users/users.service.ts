import { DbService } from '@deploy/api/common/db';
import { Injectable } from '@nestjs/common';
import { IUserPlaintData, IUserUpdate } from './user.interface';
import { isUUID } from 'class-validator';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
    constructor(private readonly _db: DbService){}

    public async create(data: { role: "admin" | "collaborator", name: string, email: string, password?: string }): Promise<IUserPlaintData> {
        const user: IUserPlaintData = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            role: data.role,
            name: data.name,
            email: data.email,
            password: data.password ?? await hash("admin")
        }
        const conn = await this._db.getConnection();
        const values = Object.values(user);
        const sql = `INSERT INTO users(${Object.keys(data).join(", ")}) VALUES(${Array(values.length).fill('?').join(',')})`;
        await conn.run({ sql, values });
        conn.close();
        return user;
    }

    public async get(value: string): Promise<IUserPlaintData | undefined> {
        const conn = await this._db.getConnection();
        const res = await conn.get<IUserPlaintData | undefined>(`SELECT * FROM users WHERE ${isUUID(value) ? 'id' : 'email'} = ?`, [value]);
        conn.close();
        return res;
    }

    public async getAll(filter?: { ignore?: string }): Promise<IUserPlaintData[]>{
        const con = await this._db.getConnection();
        let list: IUserPlaintData[];
        if (filter?.ignore){
            list = await con.all<IUserPlaintData[]>("SELECT * FROM users WHERE id <> ?", filter.ignore);
        } else {
            list = await con.all<IUserPlaintData[]>("SELECT * FROM users");
        }
        con.close();
        return list;
    }

    public async update(id: string, data: { email?: string, name?: string, role?: "admin" | "collaborator", password?: string }): Promise<void> {
        const update: IUserUpdate = {};
        if (data.email) update.email = data.email.toLowerCase();
        if (data.name) update.name = data.name;
        if (data.role) update.role = data.role;
        if (data.password) update.password = await hash(data.password);
        const sql = `UPDATE users SET ${Object.keys(update).map(x => `${x} = ?`).join(", ")} WHERE id = ?`;
        const conn = await this._db.getConnection();
        await conn.run({ sql, values: [...Object.values(update), id] })
        conn.close();
    }

    public async delete(id: string): Promise<void> {
        const conn = await this._db.getConnection();
        await conn.run({ sql: "DELETE FROM users WHERE id = ?", values: [id] });
    }
}
