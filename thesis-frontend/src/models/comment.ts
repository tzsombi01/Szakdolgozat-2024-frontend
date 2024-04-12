import { Entity } from "./entity";

export interface Comment extends Entity {
    creator: string;
    description?: string;
    edited: boolean;
}

export interface CommentInput {
    creator: string;
    description?: string;
    edited: boolean;
}
