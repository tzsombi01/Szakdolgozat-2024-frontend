import { Entity } from "./entity";

export interface Status extends Entity {
    name: string;
    type: StatusType;
    project: string;
}

export interface StatusInput {
    name: string;
    type: StatusType;
    project: string;
}

export enum StatusType {
    CRITICAL = 'CRITICAL', // RED
    WORKING_ON_IT = 'WORKING_ON_IT', // GREEN
    TBD = 'TBD', // BLUE
    DONE = 'DONE', // LIGHT BLUE
    NORMAL = 'NORMAL' // WHITE
}