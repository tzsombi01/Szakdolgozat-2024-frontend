import { Entity } from "./entity";

export interface Invite extends Entity {
    user: string;
    project: string;
}

export interface InviteInput {
    user: string;
    project: string;
}
