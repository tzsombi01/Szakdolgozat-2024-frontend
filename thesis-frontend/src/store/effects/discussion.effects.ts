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
} from "../actions/discussion.actions";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class DiscussionEffects {
  constructor(
    private actions$: Actions,
    private discussionService: DiscussionService
  ) {}

  getDiscussions$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(getDiscussionsRequest),
        concatMap(({ queryOptions }) => {
            return this.discussionService.getDiscussions(queryOptions).pipe(
                map(({ data }) => {
                    return getDiscussionsSuccess({
                        payload: {
                            data: {
                                content: data.getDiscussions.content,
                                total: data.getDiscussions.total
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

  createDiscussion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createDiscussionRequest),
      mergeMap(({ discussion, queryOptions }) => {
        return this.discussionService.createDiscussion(discussion).pipe(
          mergeMap(({ data }) => {
            return of(
              createDiscussionSuccess({
                payload: {
                  data: data.createDiscussion,
                  error: '',
                  loading: false,
                },
              }),
              getDiscussionsRequest({ queryOptions })
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
      mergeMap(({ id, discussion, file, queryOptions }) => {
        return this.discussionService.editDiscussion(id, discussion).pipe(
          mergeMap(({ data }) => {
            let actions = [
              editDiscussionSuccess({
                payload: {
                  data: data.editDiscussion,
                  error: '',
                  loading: false,
                },
              }),
            ];

            if (queryOptions) {
              actions.push(getDiscussionsRequest({ queryOptions }) as any);
            }

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
      mergeMap(({ id, queryOptions }) => {
        return this.discussionService.deleteDiscussion(id).pipe(
          mergeMap(({ data }) => {
            return of(
              deleteDiscussionSuccess({
                payload: {
                  data: data.deleteDiscussion,
                  error: '',
                  loading: false,
                },
              }),
              getDiscussionsRequest({ queryOptions })
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
