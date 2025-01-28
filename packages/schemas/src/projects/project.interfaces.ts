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
