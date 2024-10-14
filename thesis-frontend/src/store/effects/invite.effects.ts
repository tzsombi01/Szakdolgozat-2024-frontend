import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InviteService } from "src/services/invite.service";
import {
  editInviteError,
  editInviteRequest,
  editInviteSuccess,
  getInvitesError,
  getInvitesSuccess,
  getInvitesRequest,
  acceptInviteRequest,
  acceptInviteSuccess,
  acceptInviteError,
  declineInviteRequest,
  declineInviteSuccess,
  declineInviteError,
} from "../actions/invite.actions";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class InviteEffects {

  constructor(
    private actions$: Actions,
    private inviteService: InviteService
  ) { }

  getInvites$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getInvitesRequest),
      concatMap(({ queryOptions }) => {
        return this.inviteService.getInvites(queryOptions).pipe(
          map((data) => {
            return getInvitesSuccess({
              payload: {
                data: {
                  content: data.content,
                  total: data.content.length
                },
                error: '',
                loading: false
              }
            });
          }),
          catchError((err) => {
            return of(getInvitesError({
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

  acceptInvite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(acceptInviteRequest),
      mergeMap(({ id }) => {
        return this.inviteService.acceptInvite(id).pipe(
          mergeMap((data) => {
            return of(
              acceptInviteSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              })
            );
          }),
          catchError((err) => {
            return of(
              acceptInviteError({
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

  editInvite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editInviteRequest),
      mergeMap(({ id, invite }) => {
        return this.inviteService.editInvite(id, invite).pipe(
          mergeMap((data) => {
            return of(editInviteSuccess({
              payload: {
                data: data,
                error: '',
                loading: false,
              },
            }));
          }),
          catchError((err) => {
            return of(
              editInviteError({
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

  declineInvite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(declineInviteRequest),
      mergeMap(({ id }) => {
        return this.inviteService.declineInvite(id).pipe(
          mergeMap((data) => {
            return of(
              declineInviteSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              })
            );
          }),
          catchError((err) => {
            return of(
              declineInviteError({
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
