export interface ApiResponseBase<T> {
    version: string;
    status_code: number;
    message: string | string[];
    warning: string | string[];
    status: number;
    data: T;
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