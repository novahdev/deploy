import { DbService } from '@deploy/api/common/db';
import { Injectable } from '@nestjs/common';
import { IToken, ITokenAuth, ITokenPlaintData } from './tokens.interfaces';
import { IUserPlaintData } from '../users';

@Injectable()
export class TokensService {
    constructor(private readonly _db: DbService){}

    private parse(data: ITokenPlaintData): IToken {
        return {
            id: data.id,
            createdAt: new Date(data.createdAt),
            userId: data.userId,
            type: data.type,
            hostname: data.hostname,
            ip: data.ip,
            device: data.device,
            platform: data.platform,
            exp: data.exp ? new Date(data.exp) : null
        }
    }

    public async create(data: { userId: string, type: "cli" | "web", hostname: string, ip: string, device: string, platform: string | null, exp: Date | null }): Promise<IToken> {
        const token: ITokenPlaintData = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            userId: data.userId,
            type: data.type,
            hostname: data.hostname,
            ip: data.ip,
            device: data.device,
            platform: data.platform,
            exp: data.exp ? data.exp.toISOString() : null
        }
        const conn = await this._db.getConnection();
        const values = Object.values(token);

        // Obtener los Tokens actuales
        const tokens = await conn.all<{ id: string, createdAt: string, userId: string, type: "cli" | "web", hostname: string, ip: string, device: string, platform: string | null, exp: string | null }[]>("SELECT * FROM users_tokens WHERE userId = ? AND type = ? ORDER BY CASE WHEN exp IS NULL THEN 1 ELSE 0 END, exp DESC", [data.userId, data.type]);
        
        if (tokens.length > 2){
            const remove = tokens.splice(2, tokens.length);
            let conditions = Array(remove.length).fill("id = ?").join(" OR ");
            const params = remove.map(x => x.id)
            if (data.type == "cli"){
                conditions += " OR hostname = ?";
                params.push(data.hostname);
            }
            await conn.run(`DELETE FROM users_tokens WHERE ${conditions}`, params);
        }

        const sql = `INSERT INTO users_tokens(${Object.keys(token).join(", ")}) VALUES(${Array(values.length).fill('?').join(',')});`;
        await conn.run({ sql, values: values });
        conn.close();
        return this.parse(token);
    }

    public async getAll(filter: { userId?: string }): Promise<IToken[]> {
        let sql = "SELECT * FROM users_tokens";
        const params: string[] = [];
        if (filter.userId){
            sql += " WHERE userId = ?";
            params.push(filter.userId);
        }
        const conn = await this._db.getConnection();
        const result = await conn.all<ITokenPlaintData[]>({ sql, values: params });
        conn.close();
        return result.map(x => this.parse(x));
    }

    public async get(id: string): Promise<IToken | undefined> {
        const sql = "SELECT * FROM users_tokens WHERE id = ?";
        const conn = await this._db.getConnection();
        const result = await conn.get<ITokenPlaintData | undefined>({ sql, values: [id] });
        conn.close();
        return result ? this.parse(result) : undefined;
    }

    public async update(id: string, values: { exp?: Date | null, ip?: string }){
        if (values.exp !== undefined) {
            const conn = await this._db.getConnection();
            await conn.run("UPDATE users_tokens SET exp = ? WHERE id = ?", [values.exp ? values.exp.toISOString() : null, id]);
        }
    }

    public async verify(id: string): Promise<ITokenAuth | undefined> {
        const sql = "SELECT u.*, t.type as tokenType, t.exp as tokenExp, t.hostname as tokenHostname from users_tokens t INNER JOIN users u on u.id = t.userId WHERE t.id = ?";
        const conn = await this._db.getConnection();

        const result = await conn.get<IUserPlaintData&{ tokenType: string, tokenExp: string | null, tokenHostname: string }  | undefined>(sql, [id]);
        conn.close();
        if (result){
            return {
                id: result.id,
                role: result.role,
                name: result.name,
                email: result.email,
                exp: result.tokenExp ? new Date(result.tokenExp) : null,
                hostname: result.tokenHostname,
            }
        }
        return undefined;
    }

    public async delete(id: string): Promise<void> {
        const conn = await this._db.getConnection();
        await conn.run("DELETE FROM users_tokens WHERE id = ?", [id]);
        conn.close();
    }
}
