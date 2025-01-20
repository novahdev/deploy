import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    public readonly version: string;
    public readonly environment: string;

    constructor() {
        const env = process.env;
        this.environment = env.NODE_ENV || 'development';
        this.version = env.VERSION;
    }
}
