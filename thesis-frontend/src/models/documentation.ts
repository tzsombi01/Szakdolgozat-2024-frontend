import { Entity } from "./entity";

export interface Documentation extends Entity {
    creator: string;
    description?: string;
    project: string;
    name: string;
    comments: string[];
}

export interface DocumentationInput {
    description?: string;
    project: string;
    name: string;
    comments: string[];
}