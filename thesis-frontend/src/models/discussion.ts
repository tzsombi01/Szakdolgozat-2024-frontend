import { Entity } from "./entity";

export interface Discussion extends Entity {
    creator: string;
    description?: string;
    name: string;
    comments: string[];
}

export interface DiscussionInput {
    creator: string;
    description?: string;
    name: string;
    comments: string[];
}