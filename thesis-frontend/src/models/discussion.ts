import { Entity } from "./entity";

export interface Discussion extends Entity {
    creator: string;
    description?: string;
    project: string;
    name: string;
    comments: string[];
}

export interface DiscussionInput {
    description?: string;
    project: string;
    name: string;
    comments: string[];
}