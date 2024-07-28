import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ProjectService } from "src/services/project.service";
import {
  createProjectError,
  createProjectRequest,
  createProjectSuccess,
  editProjectError,
  editProjectRequest,
  editProjectSuccess,
  deleteProjectError,
  deleteProjectRequest,
  deleteProjectSuccess,
  getProjectsError,
  getProjectsSuccess,
  getProjectsRequest,
  getProjectRequest,
  getProjectSuccess,
  getProjectError,
} from "../actions/project.actions";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class ProjectEffects {
  constructor(
    private actions$: Actions,
    private projectService: ProjectService
  ) { }

  getProjects$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getProjectsRequest),
      concatMap(({ queryOptions }) => {
        return this.projectService.getProjects(queryOptions).pipe(
          map((data) => {
            return getProjectsSuccess({
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
            return of(getProjectsError({
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

  getProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getProjectRequest),
      mergeMap(({ id }) => {
        return this.projectService.getProject(id).pipe(
          mergeMap((data) => {
            return of(
              getProjectSuccess({
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
              getProjectError({
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

  createProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createProjectRequest),
      mergeMap(({ project, queryOptions }) => {
        return this.projectService.createProject(project).pipe(
          mergeMap((data) => {
            return of(
              createProjectSuccess({
                payload: {
                  data,
                  error: '',
                  loading: false,
                },
              }),
              getProjectsRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              createProjectError({
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

  editProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editProjectRequest),
      mergeMap(({ id, project, queryOptions }) => {
        return this.projectService.editProject(id, project).pipe(
          mergeMap((data) => {
            let actions = [
              editProjectSuccess({
                payload: {
                  data,
                  error: '',
                  loading: false,
                },
              }),
            ];

            if (queryOptions) {
              actions.push(getProjectsRequest({ queryOptions }) as any);
            }

            return of(...actions);
          }),
          catchError((err) => {
            return of(
              editProjectError({
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

  deleteProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteProjectRequest),
      mergeMap(({ id, queryOptions }) => {
        return this.projectService.deleteProject(id).pipe(
          mergeMap((data) => {
            return of(
              deleteProjectSuccess({
                payload: {
                  data,
                  error: '',
                  loading: false,
                },
              }),
              getProjectsRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              deleteProjectError({
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
