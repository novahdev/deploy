import { definePropertiesOnObject } from "@deploy/core/utils/define-properties-on-object"
import { OmitBy } from "@deploy/core/types";
import { ApiProjectRaw } from "@deploy/schemas/api"
import { Framework, ProjectStatus, Repository, RunningOn, RuntimeEnvironment } from "@deploy/schemas/projects"

export class Project {
    public readonly id: string
    public readonly createdAt: Date
    public readonly updatedAt: Date
    public readonly deployAt: Date | null
    public readonly status:ProjectStatus
    public readonly isOnline: boolean
    public readonly domain: string
    public readonly name: string
    public readonly processName: string
    public readonly version: string | null
    public readonly location: string
    public readonly startupFile: string
    public readonly framework: Framework | null
    public readonly runningOn: RunningOn | null
    public readonly runtimeEnvironment: RuntimeEnvironment | null
    public readonly url: string | null
    public readonly repository: Repository | null
    public readonly env: { [key: string]: string }
    public readonly ignore: string[]
    public readonly observation: string | null
    public readonly permissions: string[]

    constructor(data: ApiProjectRaw){
        this.id = data.id
        this.createdAt = new Date(data.created_at)
        this.updatedAt = new Date(data.updated_at)
        this.deployAt = data.deploy_at ? new Date(data.deploy_at) : null
        this.status = data.status
        this.isOnline = data.is_online
        this.domain = data.domain
        this.name = data.name
        this.processName = data.process_name
        this.version = data.version
        this.location = data.location
        this.startupFile = data.startup_file
        this.framework = data.framework
        this.runningOn = data.running_on
        this.runtimeEnvironment = data.runtime_environment
        this.url = data.url
        this.repository = data.repository
        this.env = data.env
        this.ignore = data.ignore
        this.observation = data.observation
        this.permissions = data.permissions
    }


    update(data: Partial<IProject>){
        definePropertiesOnObject(this, data);
    }
}

export interface IProject {
    id: string
    createdAt: Date
    updatedAt: Date
    deployAt: Date | null
    status:ProjectStatus
    isOnline: boolean
    domain: string
    name: string
    processName: string
    version: string | null
    location: string
    startupFile: string
    framework: Framework | null
    runningOn: RunningOn | null
    runtimeEnvironment: RuntimeEnvironment | null
    url: string | null
    repository: Repository | null
    env: { [key: string]: string }
    ignore: string[]
    observation: string | null
    permissions: string[]
}