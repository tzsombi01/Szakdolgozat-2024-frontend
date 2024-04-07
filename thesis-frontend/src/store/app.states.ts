import { Ticket } from "src/models/ticket";
import { Comment } from "src/models/comment";
import { State } from "./models";
import { Documentation } from "src/models/documentation";
import { Discussion } from "src/models/discussion";

export interface AppState {
    ticketState: TicketState;
    commentState: CommentState;
    discussionState: DiscussionState;
    documentationState: DocumentationState;
}

export interface TicketState extends State {
    tickets: Ticket[];
    ticket: Ticket;
    total: number;
}

export interface CommentState extends State {
    comments: Comment[];
    comment: Comment;
    total: number;
}

export interface DocumentationState extends State {
    documentations: Documentation[];
    documentation: Documentation;
    total: number;
}

export interface DiscussionState extends State {
    discussions: Discussion[];
    discussion: Discussion;
    total: number;
}
