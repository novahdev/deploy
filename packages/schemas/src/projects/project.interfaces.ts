import { FRAMEWORK_LIST, RUNNING_ON_LIST, RUNTIME_ENVIRONMENT_LIST } from "./project.const";

export type Framework = typeof FRAMEWORK_LIST[number];
export type RunningOn = typeof RUNNING_ON_LIST[number];
export type RuntimeEnvironment = typeof RUNTIME_ENVIRONMENT_LIST[number];
export type ProjectStatus = "online" | "stopping" | "stopped" | "launching" | "errored" | "one-launch-status";

export interface IProject {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deployAt: Date | null;
    domain: string;
    name: string;
    processName: string;
    version: string | null; 
    location: string;
    startupFile: string;
    framework: Framework | null;
    runningOn: RunningOn | null;
    runtimeEnvironment: RuntimeEnvironment | null;
    url: string | null;
    repository: { 
        type: "git",
        url: string
    } | null;
    env: { [key: string]: string }
    ignore: string[];
    observations: string | null;
}
