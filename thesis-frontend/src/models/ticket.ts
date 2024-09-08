import { Entity } from "./entity";

export interface Ticket extends Entity {
    ticketNumber: number;
    name: string;
    project: string;
    assignee?: string;
    creator: string;
    description?: string;
    ticketReferences: string[];
    statuses: string[];
    comments: string[];
    mentionedInCommits: string[];
}

export interface TicketInput {
    assignee?: string;
    name: string;
    project: string;
    description?: string;
    ticketReferences: string[];
    statuses: string[];
    comments: string[];
    mentionedInCommits: string[];
}
