import { Framework, FRAMEWORK_LIST, RUNNING_ON_LIST, RunningOn, RUNTIME_ENVIRONMENT_LIST, RuntimeEnvironment } from "@deploy/schemas/projects"
import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl } from "class-validator"
import { Expose } from 'class-transformer';

export class ProjectCreateDto {
    @IsString()
    @IsNotEmpty()
    domain: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    @Expose({ name: 'process_name' })
    processName: string

    @IsString()
    @IsOptional()
    version: string | null

    @IsString()
    location: string

    @IsString()
    @Expose({ name: 'startup_file' })
    startupFile: string

    @IsIn(FRAMEWORK_LIST)
    @IsOptional()
    framework?: Framework | null

    @IsIn(RUNNING_ON_LIST)
    @IsOptional()
    @Expose({ name: 'running_on' })
    runningOn?: RunningOn | null;

    @IsIn(RUNTIME_ENVIRONMENT_LIST)
    @IsOptional()
    @Expose({ name: 'runtime_environment' })
    runtimeEnvironment?: RuntimeEnvironment | null;

    @IsUrl()
    @IsOptional()
    url?: string;
    @IsOptional()
    repository?: undefined

    @IsObject()
    @IsOptional()
    env?: { [key: string]: string }

    @IsString({ each: true })
    @IsOptional()
    ignore?: string[]
}