import { ApiResponse } from "./api-response-base.interfaces";

export interface ApiAuthResponse extends ApiResponse {
    data: {
        role: "admin" | "collaborator",
        name: string,
        token: string,
    }
}
export interface ApiAccessTokensResponse extends ApiResponse {
    data: {
        id: string,
        created_at: string,
        type: "cli" | "web",
        hostname: string,
        ip: string,
        device: "desktop" | "mobile" | "tablet",
        platform: string | null,
        exp: string | null
    }[]
}