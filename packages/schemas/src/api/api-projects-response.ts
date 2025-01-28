import { Framework, ProjectStatus, Repository, RunningOn, RuntimeEnvironment } from "../projects";
import { ApiResponseBase } from "./api-response-base.interfaces";

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

export interface ApiProjectsResponse extends ApiResponseBase { 
  data: ApiProjectRaw[];
}
export interface ApiProjectResponse extends ApiResponseBase { 
  data: ApiProjectRaw;
}

export interface ApiProjectCreateRequest {
  name: string;
  domain: string;
  process_name: string;
  location: string;
  startup_file: string;
  framework?: Framework;
  running_on?: RunningOn;
  runtime_environment?: RuntimeEnvironment;
  repository?: Repository;
  env?: { [key: string]: string };
  ignore?: string[];
  observation?: string | null;
}

export interface ApiProjectUpdateRequest { 
  name?: string;
  domain?: string;
  process_name?: string;
  location?: string;
  startup_file?: string;
  framework?: Framework | null;
  running_on?: RunningOn | null;
  runtime_environment?: RuntimeEnvironment |null;
  repository?: Repository;
  env?: { [key: string]: string };
  ignore?: string[];
  observation?: string | null;
  url?: string | null;
}