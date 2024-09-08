import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DocumentationService } from "src/services/documentation.service";
import {
  createDocumentationError,
  createDocumentationRequest,
  createDocumentationSuccess,
  editDocumentationError,
  editDocumentationRequest,
  editDocumentationSuccess,
  deleteDocumentationError,
  deleteDocumentationRequest,
  deleteDocumentationSuccess,
  getDocumentationsError,
  getDocumentationsSuccess,
  getDocumentationsRequest,
} from "../actions/documentation.actions";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class DocumentationEffects {
  constructor(
    private actions$: Actions,
    private documentationService: DocumentationService
  ) { }

  getDocumentations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDocumentationsRequest),
      concatMap(({ queryOptions }) => {
        return this.documentationService.getDocumentations(queryOptions).pipe(
          map((data) => {
            return getDocumentationsSuccess({
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
            return of(getDocumentationsError({
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

  createDocumentation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createDocumentationRequest),
      mergeMap(({ documentation, queryOptions }) => {
        return this.documentationService.createDocumentation(documentation).pipe(
          mergeMap((data) => {
            return of(
              createDocumentationSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              }),
              getDocumentationsRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              createDocumentationError({
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

  editDocumentation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editDocumentationRequest),
      mergeMap(({ id, documentation, queryOptions }) => {
        return this.documentationService.editDocumentation(id, documentation).pipe(
          mergeMap((data) => {
            let actions = [
              editDocumentationSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              }),
            ];

            if (queryOptions) {
              actions.push(getDocumentationsRequest({ queryOptions }) as any);
            }

            return of(...actions);
          }),
          catchError((err) => {
            return of(
              editDocumentationError({
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

  deleteDocumentation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteDocumentationRequest),
      mergeMap(({ id, queryOptions }) => {
        return this.documentationService.deleteDocumentation(id).pipe(
          mergeMap((data) => {
            return of(
              deleteDocumentationSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              }),
              getDocumentationsRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              deleteDocumentationError({
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
