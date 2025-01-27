import { ApiResponse } from "./api-response-base.interfaces"

export interface ApiProfileGetInfoResponse extends ApiResponse {
    data: {
        role: string,
        name: string,
        email: string
    }
}

export interface ApiProfileUpdateBody {
    name: string
    email: string
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