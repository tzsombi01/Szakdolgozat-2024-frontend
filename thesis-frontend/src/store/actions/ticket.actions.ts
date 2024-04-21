import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { TicketInput } from "src/models/ticket";
import { QueryOptions } from "src/models/query-options";

export const getTicketsRequest = createAction('[ Ticket ] GetTicketsRequest', props<{ queryOptions: QueryOptions }>());
export const getTicketsSuccess = createAction('[ Ticket ] GetTicketsSuccess', props<{ payload: Payload }>());
export const getTicketsError = createAction('[ Ticket ] GetTicketsError', props<{ payload: Payload }>());

export const getTicketRequest = createAction('[ Ticket ] GetTicketRequest', props<{ id: string }>());
export const getTicketSuccess = createAction('[ Ticket] GetTicketSuccess', props<{ payload: Payload }>());
export const getTicketError = createAction('[ Ticket ] GetTicketError', props<{ payload: Payload }>());

export const createTicketRequest = createAction('[ Ticket ] CreateTicketRequest', props<{ ticket: TicketInput, queryOptions: QueryOptions }>());
export const createTicketSuccess = createAction('[ Ticket ] CreateTicketSuccess', props<{ payload: Payload }>());
export const createTicketError = createAction('[ Ticket ] CreateTicketError', props<{ payload: Payload }>());

export const editTicketRequest = createAction('[ Ticket ] EditTicketRequest', props<{ id: string, ticket: TicketInput, queryOptions?: QueryOptions }>());
export const editTicketSuccess = createAction(' [Ticket ] EditTicketSuccess', props<{ payload: Payload }>());
export const editTicketError = createAction('[ Ticket ] EditTicketError', props<{ payload: Payload }>());

export const deleteTicketRequest = createAction('[ Ticket ] DeleteTicketRequest', props<{ id: string, queryOptions: QueryOptions }>());
export const deleteTicketSuccess = createAction('[ Ticket ] DeleteTicketSuccess', props<{ payload: Payload }>());
export const deleteTicketError = createAction('[ Ticket ] DeleteTicketError', props<{ payload: Payload }>());

