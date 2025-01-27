export class User {
    public readonly id: string;
    public readonly createdAt: Date;
    public readonly role: "admin" | "collaborator";
    public readonly name: string;
    public readonly email: string;

    constructor(data: { 
        id: string, 
        created_at: string, 
        role: "admin" | "collaborator", 
        name: string, 
        email: string
    }){
        this.id = data.id;
        this.createdAt = new Date(data.created_at);
        this.role = data.role;
        this.name = data.name;
        this.email = data.email;

    }
}