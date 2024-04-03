import { Ticket } from "src/models/ticket";
import { Comment } from "src/models/comment";
import { State } from "./models";

export interface AppState {
    ticketState: TicketState;
    commentState: CommentState;
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
