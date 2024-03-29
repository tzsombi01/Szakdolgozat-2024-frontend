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

export interface TicketInput extends Entity {
    assignee?: string;
    creator: string;
    description?: string;
    ticketReferences: string[];
    statuses: string[];
    comments: string[];
    mentionedInCommits: string[];
}
