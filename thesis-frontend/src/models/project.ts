import { Entity } from "./entity";

export interface Project extends Entity {
    url: string;
    name: string;
    tickets: string[];
    users: string[];
}

export interface ProjectInput {
    url: string;
    name: string;
    tickets: string[]; 
    users: string[];
}