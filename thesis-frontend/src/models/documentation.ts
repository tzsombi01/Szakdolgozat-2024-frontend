import { Entity } from "./entity";

export interface Documentation extends Entity {
    creator: string;
    description?: string;
    name: string;
    comments: string[];
}

export interface DocumentationInput {
    creator: string;
    description?: string;
    name: string;
    comments: string[];
}