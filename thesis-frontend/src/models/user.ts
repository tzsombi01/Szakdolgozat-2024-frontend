import { Entity } from "./entity";

export interface User extends Entity {
    userName: string;
    description?: string;
    name: string;
    comments: string[];
}

export interface UserInput {
    creator: string;
    description?: string;
    name: string;
    comments: string[];
}