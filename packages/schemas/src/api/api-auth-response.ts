import { ApiResponse } from "./api-response-base.interfaces";

export interface ApiAuthResponse extends ApiResponse {
    data: {
        role: "admin" | "collaborator",
        name: string,
        token: string,
    }
}
