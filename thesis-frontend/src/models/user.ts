import { Entity } from "./entity";

export interface User extends Entity {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    gitUserNames: string[];
}

export interface UserInput {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    gitUserNames: string[];
    password: string;
}