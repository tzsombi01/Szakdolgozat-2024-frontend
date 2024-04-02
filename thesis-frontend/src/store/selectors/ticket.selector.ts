import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TicketState } from "src/store/app.states";

export const getTicketState = createFeatureSelector<TicketState>('ticketState');

export const getTickets = createSelector(
    getTicketState,
    (state: TicketState) => state.tickets
);

export const getTicketsWithTotal = createSelector(
    getTicketState,
    (state: TicketState) => {
        return {
            tickets: state.tickets,
            total: state.total
        }
    }
);

export const getTicketLoading = createSelector(
    getTicketState,
    (state: TicketState) => state.loading
);

export const getTicketError = createSelector(
    getTicketState,
    (state: TicketState) => state.error
);
