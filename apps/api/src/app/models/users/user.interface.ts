export interface IUserPlaintData {
    id: string,
    createdAt: string
    updatedAt: string
    role: "admin" | "collaborator"
    name: string
    email: string
    password: string
}

export interface IUser {
    id: string,
    createdAt: Date
    updatedAt: Date
    role: "admin" | "collaborator"
    name: string
    email: string
    password: string
}

export interface IUserUpdate {
    updatedAt?: Date
    role?: "admin" | "collaborator"
    name?: string
    email?: string
    password?: string
}
export interface IUserUpdatePlaint {
    updatedAt?: string
    role?: "admin" | "collaborator"
    name?: string
    email?: string
    password?: string
}