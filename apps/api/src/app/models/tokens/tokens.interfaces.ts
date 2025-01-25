export interface ITokenPlaintData {
    id: string;
    createdAt: string;
    userId: string;
    type: "cli" | "web";
    hostname: string;
    ip: string;
    device: "desktop" | "mobile" | "tablet";
    platform: string | null;
    exp: string | null
}

export interface IToken {
    id: string;
    createdAt: Date;
    userId: string;
    type: "cli" | "web";
    hostname: string;
    ip: string;
    device: "desktop" | "mobile" | "tablet";
    platform: string | null;
    exp: Date | null
}

export interface ITokenAuth {
    id: string;
    role: "admin" | "collaborator";
    name: string
    email: string
    exp: Date | null
    hostname: string
}
