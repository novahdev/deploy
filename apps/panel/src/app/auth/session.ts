import { BehaviorSubject } from "rxjs";

export class Session {
    public readonly role: "admin" | "collaborator";
    public readonly isAdmin: boolean;
    public readonly name: string;
    public readonly token: string;
    public readonly _valueChanges: BehaviorSubject<{ role: "admin" | "collaborator", name: string, token: string }>;

    constructor(data: { role: "admin" | "collaborator", name: string, token: string }){
        this.role = data.role;
        this.isAdmin = data.role === "admin";
        this.name = data.name;
        this.token = data.token;
        this._valueChanges = new BehaviorSubject(data);
    }

    public get valueChanges(){
        return this._valueChanges.asObservable();
    }

    public update(data: { name?: string, token?: string }): void {
        const entries = Object.entries(data);
        if (entries.length > 0){
            const properties: PropertyDescriptorMap = {};
            entries.forEach(([key, value]) => { 
                properties[key] = { value, writable: true }
            });
            Object.defineProperties(this, properties);
            localStorage.setItem("app-token", window.btoa(JSON.stringify({
                role: this.role,
                name: this.name,
                token: this.token
            })));
            this._valueChanges.next({ role: this.role, name: this.name, token: this.token });
        }
    }
}