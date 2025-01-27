export class AccessToken {
    public readonly id: string;
    public readonly createdAt: Date;
    public readonly type: "cli" | "web";
    public readonly hostname: string;
    public readonly ip: string;
    public readonly device: "desktop" | "mobile" | "tablet";
    public readonly platform: string | null;
    public readonly exp: Date | null;

    constructor(data: {
        id: string,
        created_at: string,
        type: "cli" | "web",
        hostname: string,
        ip: string,
        device: "desktop" | "mobile" | "tablet",
        platform: string | null,
        exp: string | null
    }) {
        this.id = data.id;
        this.createdAt = new Date(data.created_at);
        this.type = data.type;
        this.hostname = data.hostname;
        this.ip = data.ip;
        this.device = data.device;
        this.platform = data.platform;
        this.exp = data.exp ? new Date(data.exp) : null;
    }
}