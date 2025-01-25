export interface ApiResponseBase {
    version: string;
    status_code: number;
    message?: string;
    warning?: string;
    status: number;
    error?: {
        code: string;
        message: string;
        details: string[];
    }
    support: {
        mail: string;
        homepage: string;
    }
}

export interface ApiResponse {
    message?: string;
    warning?: string;
}