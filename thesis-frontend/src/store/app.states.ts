import { Ticket } from "src/models/ticket";
import { State } from "./models";

export interface AppState {
    ticketState: TicketState;
}

export interface TicketState extends State {
    tickets: Ticket[];
    ticket: Ticket;
    total: number;
}
