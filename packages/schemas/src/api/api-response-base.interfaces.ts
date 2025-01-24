export interface ApiResponseBase {
    version: string;
    status_code: number;
    message?: string | string[];
    warning?: string | string[];
    status?: number;
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