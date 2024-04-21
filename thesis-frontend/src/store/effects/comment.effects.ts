import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CommentService } from "src/services/comment.service";
import {
    createCommentError,
    createCommentRequest,
    createCommentSuccess,
    editCommentError,
    editCommentRequest,
    editCommentSuccess,
    deleteCommentError,
    deleteCommentRequest,
    deleteCommentSuccess,
    getCommentsError,
    getCommentsSuccess,
    getCommentsRequest,
} from "../actions/comment.actions";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class CommentEffects {
  
  constructor(
    private actions$: Actions,
    private commentService: CommentService
  ) {}

  getComments$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(getCommentsRequest),
        concatMap(({ queryOptions }) => {
            return this.commentService.getComments(queryOptions).pipe(
                map(({ data }) => {
                    return getCommentsSuccess({
                        payload: {
                            data: {
                                content: data.getComments.content,
                                total: data.getComments.total
                            },
                            error: '',
                            loading: false
                        }
                    });
                }),
                catchError((err) => {
                    return of(getCommentsError({
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

  createComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createCommentRequest),
      mergeMap(({ comment, queryOptions }) => {
        return this.commentService.createComment(comment).pipe(
          mergeMap(({ data }) => {
            return of(
              createCommentSuccess({
                payload: {
                  data: data.createComment,
                  error: '',
                  loading: false,
                },
              }),
              getCommentsRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              createCommentError({
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

  editComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editCommentRequest),
      mergeMap(({ id, comment, queryOptions }) => {
        return this.commentService.editComment(id, comment).pipe(
          mergeMap(({ data }) => {
            let actions = [
              editCommentSuccess({
                payload: {
                  data: data.editComment,
                  error: '',
                  loading: false,
                },
              }),
            ];

            if (queryOptions) {
              actions.push(getCommentsRequest({ queryOptions }) as any);
            }

            return of(...actions);
          }),
          catchError((err) => {
            return of(
              editCommentError({
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

  deleteComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteCommentRequest),
      mergeMap(({ id, queryOptions }) => {
        return this.commentService.deleteComment(id).pipe(
          mergeMap(({ data }) => {
            return of(
              deleteCommentSuccess({
                payload: {
                  data: data.deleteComment,
                  error: '',
                  loading: false,
                },
              }),
              getCommentsRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              deleteCommentError({
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
