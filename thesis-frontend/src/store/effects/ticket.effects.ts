import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TicketService } from "src/services/ticket.service";
import {
  createTicketError,
  createTicketRequest,
  createTicketSuccess,
  editTicketError,
  editTicketRequest,
  editTicketSuccess,
  deleteTicketError,
  deleteTicketRequest,
  deleteTicketSuccess,
  getTicketsError,
  getTicketsSuccess,
  getTicketsRequest,
} from "../actions/ticket.actions";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class TicketEffects {
  constructor(
    private actions$: Actions,
    private ticketService: TicketService
  ) { }

  getTickets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getTicketsRequest),
      concatMap(({ queryOptions }) => {
        return this.ticketService.getTickets(queryOptions).pipe(
          map((data) => {
            console.log(data)
            return getTicketsSuccess({
              payload: {
                data: {
                  content: data.content,
                  total: data.totalElements
                },
                error: '',
                loading: false
              }
            });
          }),
          catchError((err) => {
            return of(getTicketsError({
              payload: {
                data: [],
                error: err,
                loading: false
              }
            }));
          })
        );
      })
    );
  });

  createTicket$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createTicketRequest),
      mergeMap(({ ticket, queryOptions }) => {
        return this.ticketService.createTicket(ticket).pipe(
          mergeMap((data) => {
            return of(
              createTicketSuccess({
                payload: {
                  data: data.createTicket,
                  error: '',
                  loading: false,
                },
              }),
              getTicketsRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              createTicketError({
                payload: {
                  data: [],
                  error: err,
                  loading: false,
                },
              })
            );
          })
        );
      })
    );
  });

  editTicket$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editTicketRequest),
      mergeMap(({ id, ticket, queryOptions }) => {
        return this.ticketService.editTicket(id, ticket).pipe(
          mergeMap((data) => {
            let actions = [
              editTicketSuccess({
                payload: {
                  data: data.editTicket,
                  error: '',
                  loading: false,
                },
              }),
            ];

            if (queryOptions) {
              actions.push(getTicketsRequest({ queryOptions }) as any);
            }

            return of(...actions);
          }),
          catchError((err) => {
            return of(
              editTicketError({
                payload: {
                  data: [],
                  error: err,
                  loading: false,
                },
              })
            );
          })
        );
      })
    );
  });

  deleteTicket$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteTicketRequest),
      mergeMap(({ id, queryOptions }) => {
        return this.ticketService.deleteTicket(id).pipe(
          mergeMap((data) => {
            return of(
              deleteTicketSuccess({
                payload: {
                  data: data.deleteTicket,
                  error: '',
                  loading: false,
                },
              }),
              getTicketsRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              deleteTicketError({
                payload: {
                  data: [],
                  error: err,
                  loading: false,
                },
              })
            );
          })
        );
      })
    );
  });
}
