import { Action, createReducer, on } from '@ngrx/store';
import { Ticket } from 'src/models/ticket';
import * as ticketActions from 'src/store/actions/ticket.actions';
import { TicketState } from 'src/store/app.states';

export const initialState: TicketState = {
    tickets: [],
    ticket: ({} as unknown) as Ticket,
    error: '',
    loading: false,
    total: 0
};

const _ticketReducer = createReducer(
    initialState,

    on(ticketActions.getTicketsRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(ticketActions.getTicketsSuccess, (state, { payload }) => {
        return {
            ...state,
            tickets: payload.data.content,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(ticketActions.getTicketsError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(ticketActions.getTicketRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(ticketActions.getTicketSuccess, (state, { payload }) => {
        return {
            ...state,
            ticket: payload.data,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(ticketActions.getTicketError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(ticketActions.createTicketRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(ticketActions.createTicketSuccess, (state, { payload }) => {
        return {
            ...state,
            tickets: [
                ...state.tickets,
                (payload.data as unknown) as Ticket
            ],
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(ticketActions.createTicketError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(ticketActions.editTicketRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(ticketActions.editTicketSuccess, (state, { payload }) => {
        let _tickets: Ticket[] = [ ...state.tickets ];
        _tickets[state.tickets.findIndex((ticket: Ticket) => ticket.id === payload.data.id)] = payload.data;
        return {
            ...state,
            tickets: _tickets,
            ticket: payload.data,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(ticketActions.editTicketError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(ticketActions.deleteTicketRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(ticketActions.deleteTicketSuccess, (state, { payload }) => {
        return {
            ...state,
            tickets: state.tickets.filter((ticket: Ticket) => ticket.id !== payload.data.id),
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(ticketActions.deleteTicketError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),
);

export function ticketReducer(state: any, action: Action): TicketState {
    return _ticketReducer(state, action);
}
