import { Ticket } from "src/models/ticket";
import { State } from "./models";

export interface AppState {

}

export interface TicketState extends State {
    tickets: Ticket[];
    ticket: Ticket;
    total: number;
}
