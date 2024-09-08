import { Entity } from "./entity";

export interface Comment extends Entity {
    creator: string;
    reference: string;
    commentType: CommentType;
    description?: string;
    edited: boolean;
}

export interface CommentInput {
    creator: string;
    reference: string;
    commentType: CommentType;
    description?: string;
    edited: boolean;
}

export enum CommentType {
    Ticket = 'Ticket',
    Documentation = 'Documentation',
    Discussion = 'Discussion'
}
