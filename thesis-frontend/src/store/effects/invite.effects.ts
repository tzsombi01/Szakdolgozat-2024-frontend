import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InviteService } from "src/services/invite.service"; // Updated from CommentService
import {
  createInviteError,
  createInviteRequest,
  createInviteSuccess,
  editInviteError,
  editInviteRequest,
  editInviteSuccess,
  deleteInviteError,
  deleteInviteRequest,
  deleteInviteSuccess,
  getInvitesError,
  getInvitesSuccess,
  getInvitesRequest,
} from "../actions/invite.actions"; // Updated from comment.actions
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
                  content: data,
                  total: data.length
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

  createInvite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createInviteRequest),
      mergeMap(({ invite }) => {
        return this.inviteService.createInvite(invite).pipe(
          mergeMap((data) => {
            return of(
              createInviteSuccess({
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
              createInviteError({
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

  deleteInvite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteInviteRequest),
      mergeMap(({ id }) => {
        return this.inviteService.deleteInvite(id).pipe(
          mergeMap((data) => {
            return of(
              deleteInviteSuccess({
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
              deleteInviteError({
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
