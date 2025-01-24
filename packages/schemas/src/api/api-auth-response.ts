import { ApiResponseBase } from "./api-response-base.interfaces";

export interface ApiAuthResponse extends ApiResponseBase {
    data: {
        role: "admin" | "collaborator",
        name: string,
        token: string,
    }
}