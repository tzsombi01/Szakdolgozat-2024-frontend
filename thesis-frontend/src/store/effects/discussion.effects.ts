import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DiscussionService } from "src/services/discussion.service";
import {
  createDiscussionError,
  createDiscussionRequest,
  createDiscussionSuccess,
  editDiscussionError,
  editDiscussionRequest,
  editDiscussionSuccess,
  deleteDiscussionError,
  deleteDiscussionRequest,
  deleteDiscussionSuccess,
  getDiscussionsError,
  getDiscussionsSuccess,
  getDiscussionsRequest,
  getDiscussionRequest,
  getDiscussionError,
  getDiscussionSuccess,
} from "../actions/discussion.actions";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class DiscussionEffects {
  constructor(
    private actions$: Actions,
    private discussionService: DiscussionService
  ) { }

  getDiscussions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDiscussionsRequest),
      concatMap(({ queryOptions }) => {
        return this.discussionService.getDiscussions(queryOptions).pipe(
          map((data) => {
            return getDiscussionsSuccess({
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
            return of(getDiscussionsError({
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

  getDiscussion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDiscussionRequest),
      mergeMap(({ id }) => {
        return this.discussionService.getDiscussion(id).pipe(
          mergeMap((data) => {
            return of(
              getDiscussionSuccess({
                payload: {
                  data,
                  error: '',
                  loading: false,
                },
              })
            );
          }),
          catchError((err) => {
            return of(
              getDiscussionError({
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

  createDiscussion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createDiscussionRequest),
      mergeMap(({ discussion }) => {
        return this.discussionService.createDiscussion(discussion).pipe(
          mergeMap((data) => {
            return of(
              createDiscussionSuccess({
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
              createDiscussionError({
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

  editDiscussion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editDiscussionRequest),
      mergeMap(({ id, discussion }) => {
        return this.discussionService.editDiscussion(id, discussion).pipe(
          mergeMap((data) => {
            let actions = [
              editDiscussionSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              }),
            ];

            return of(...actions);
          }),
          catchError((err) => {
            return of(
              editDiscussionError({
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

  deleteDiscussion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteDiscussionRequest),
      mergeMap(({ id }) => {
        return this.discussionService.deleteDiscussion(id).pipe(
          mergeMap((data) => {
            return of(
              deleteDiscussionSuccess({
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
              deleteDiscussionError({
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
