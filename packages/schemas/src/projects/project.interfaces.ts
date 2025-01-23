import { FRAMEWORK_LIST, RUNNING_ON_LIST, RUNTIME_ENVIRONMENT_LIST } from "./project.const";

export type Framework = typeof FRAMEWORK_LIST[number];
export type RunningOn = typeof RUNNING_ON_LIST[number];
export type RuntimeEnvironment = typeof RUNTIME_ENVIRONMENT_LIST[number];
export type ProjectStatus = "running" | "online" | "stopped" | "errored" | "restarting" | "updating" | "maintenance" | "degraded" | "unknown";
export interface Repository {
    type: 'git' | 'svn' | 'mercurial'; // Puedes agregar más tipos si es necesario
    url: string;
    branch?: string; // Rama opcional
    commit?: string; // Último commit opcional
  }

export interface ApiProjectRaw {
    "id": string,
    "created_at": string,
    "updated_at": string,
    "deploy_at": string | null,
    "status":ProjectStatus,
    "is_online": boolean,
    "domain": string,
    "name": string,
    "process_name": string,
    "version": string | null,
    "location": string,
    "startup_file": string,
    "framework": Framework | null,
    "running_on": RunningOn | null,
    "runtime_environment": RuntimeEnvironment | null,
    "url": string | null,
    "repository": Repository | null,
    "env": { [key: string]: string },
    "ignore": string[],
    "observation": string | null,
    "permissions": string[]
}