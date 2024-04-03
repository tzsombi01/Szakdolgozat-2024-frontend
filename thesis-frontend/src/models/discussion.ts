import { Entity } from "./entity";

export interface Discussion extends Entity {
    creator: string;
    description?: string;
    comments: string[];
}

export interface DiscussionInput extends Entity {
    creator: string;
    description?: string;
    comments: string[];
}