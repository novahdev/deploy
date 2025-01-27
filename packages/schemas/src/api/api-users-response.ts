import { ApiResponse } from "./api-response-base.interfaces";

export interface ApiUsersResponse extends ApiResponse {
    data: {
        id: string;
        created_at: string;
        role: "admin" | "collaborator";
        name: string;
        email: string;
    }[];
}

export interface ApiUserCreateResponse extends ApiResponse {
    data: {
        id: string;
        created_at: string;
        role: "admin" | "collaborator";
        name: string;
        email: string;
    }
}
