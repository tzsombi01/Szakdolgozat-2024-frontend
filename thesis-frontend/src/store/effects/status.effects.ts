import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { StatusService } from "src/services/status.service";
import {
  createStatusError,
  createStatusRequest,
  createStatusSuccess,
  editStatusError,
  editStatusRequest,
  editStatusSuccess,
  deleteStatusError,
  deleteStatusRequest,
  deleteStatusSuccess,
  getStatusesError,
  getStatusesSuccess,
  getStatusesRequest,
  getStatusRequest,
  getStatusSuccess,
  getStatusError,
} from "../actions/status.actions"; // Changed to Status actions
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class StatusEffects {
  constructor(
    private actions$: Actions,
    private statusService: StatusService
  ) { }

  getStatuses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getStatusesRequest),
      concatMap(({ queryOptions }) => {
        return this.statusService.getStatuses(queryOptions).pipe(
          map((data) => {
            return getStatusesSuccess({
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
            return of(getStatusesError({
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

  getStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getStatusRequest),
      mergeMap(({ id }) => {
        return this.statusService.getStatus(id).pipe(
          mergeMap((data) => {
            return of(
              getStatusSuccess({
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
              getStatusError({
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

  createStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createStatusRequest),
      mergeMap(({ status, queryOptions }) => {
        return this.statusService.createStatus(status).pipe(
          mergeMap((data) => {
            return of(
              createStatusSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              }),
              getStatusesRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              createStatusError({
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

  editStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editStatusRequest),
      mergeMap(({ id, status, queryOptions }) => {
        return this.statusService.editStatus(id, status).pipe(
          mergeMap((data) => {
            let actions = [
              editStatusSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              }),
            ];

            if (queryOptions) {
              actions.push(getStatusesRequest({ queryOptions }) as any);
            }

            return of(...actions);
          }),
          catchError((err) => {
            return of(
              editStatusError({
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

  deleteStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteStatusRequest),
      mergeMap(({ id, queryOptions }) => {
        return this.statusService.deleteStatus(id).pipe(
          mergeMap((data) => {
            return of(
              deleteStatusSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              }),
              getStatusesRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              deleteStatusError({
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
