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
  getDocumentationRequest,
  getDocumentationSuccess,
  getDocumentationError,
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

  getDocumentation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDocumentationRequest),
      mergeMap(({ id }) => {
        return this.documentationService.getDocumentation(id).pipe(
          mergeMap((data) => {
            return of(
              getDocumentationSuccess({
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
              getDocumentationError({
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

  createDocumentation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createDocumentationRequest),
      mergeMap(({ documentation }) => {
        return this.documentationService.createDocumentation(documentation).pipe(
          map((data) => {
            return createDocumentationSuccess({
              payload: {
                data,
                error: '',
                loading: false
              }
            });
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
      mergeMap(({ id, documentation }) => {
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
      mergeMap(({ id }) => {
        return this.documentationService.deleteDocumentation(id).pipe(
          mergeMap((data) => {
            return of(
              deleteDocumentationSuccess({
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
