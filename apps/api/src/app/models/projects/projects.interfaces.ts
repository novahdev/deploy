import { Framework, ProjectStatus, Repository, RunningOn, RuntimeEnvironment } from '@deploy/schemas/projects';

export interface IProjectPlaitData {
    id: string;
    createdAt: string;
    updatedAt: string;
    deployAt: string | null;
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
    repository: string | null;
    env:  string;
    ignore: string;
    observation: string | null,
    permissions?: string;
}

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
    repository: Repository | null;
    env: { [key: string]: string };
    ignore: string[];
    observation: string | null;
    permissions: string[];
    status: ProjectStatus;
    isOnline: boolean;
}

export type ProjectCreateValues = {
    domain: string;
    name: string;
    processName: string;
    version?: string | null;
    location: string;
    startupFile: string;
    framework?: Framework | null;
    runningOn?: RunningOn | null;
    runtimeEnvironment?: RuntimeEnvironment | null;
    url?: string | null;
    repository?: string | null;
    env?:  { [key: string]: string };
    ignore?: string[];
    observation?: string | null
}

export type ProjectUpdateValues = {
    domain?: string;
    name?: string;
    processName?: string;
    version?: string | null;
    location?: string;
    startupFile?: string;
    framework?: Framework | null;
    runningOn?: RunningOn | null;
    runtimeEnvironment?: RuntimeEnvironment | null;
    url?: string | null;
    repository?: string | null;
    env?:  { [key: string]: string };
    ignore?: string[];
    observation?: string | null
}
export type ProjectUpdateValuesPlaint = {
    domain?: string;
    name?: string;
    processName?: string;
    version?: string | null;
    location?: string;
    startupFile?: string;
    framework?: Framework | null;
    runningOn?: RunningOn | null;
    runtimeEnvironment?: RuntimeEnvironment | null;
    url?: string | null;
    repository?: string | null;
    env?: string;
    ignore?: string;
    observation?: string | null
}