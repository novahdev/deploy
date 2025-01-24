
export class Session {
    public readonly role: "admin" | "collaborator";
    public readonly isAdmin: boolean;
    public readonly token: string;

    constructor(data: { role: "admin" | "collaborator", name: string, token: string }){
        this.role = data.role;
        this.isAdmin = data.role === "admin";
        this.token = data.token;
    }
}