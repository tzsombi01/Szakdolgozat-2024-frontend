import { Entity } from "./entity";

export interface Ticket extends Entity {
    ticketNumber: number;
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
    creator: string;
    description?: string;
    ticketReferences: string[];
    statuses: string[];
    comments: string[];
    mentionedInCommits: string[];
}
