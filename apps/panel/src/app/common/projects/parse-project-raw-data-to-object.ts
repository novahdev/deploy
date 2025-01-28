import { ApiProjectRaw } from "@deploy/schemas/api";
import { IProject } from "./project.model";

export const parseProjectRawToObject = (data: ApiProjectRaw): IProject => {
    return {
        id: data.id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        deployAt: data.deploy_at ? new Date(data.deploy_at) : null,
        status: data.status,
        isOnline: data.is_online,
        domain: data.domain,
        name: data.name,
        processName: data.process_name,
        version: data.version,
        location: data.location,
        startupFile: data.startup_file,
        framework: data.framework,
        runningOn: data.running_on,
        runtimeEnvironment: data.runtime_environment,
        url: data.url,
        repository: data.repository,
        env: data.env,
        ignore: data.ignore,
        observation: data.observation,
        permissions: data.permissions
    }
}