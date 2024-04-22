import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "src/services/user.service";
import {
    createUserError,
    createUserRequest,
    createUserSuccess,
    editUserError,
    editUserRequest,
    editUserSuccess,
    deleteUserError,
    deleteUserRequest,
    deleteUserSuccess,
    getUsersError,
    getUsersSuccess,
    getUsersRequest,
    loginRequest,
    loginSuccess,
    registerRequest,
    registerSuccess,
    registerError,
} from "../actions/user.actions"; 
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class UserEffects {
  
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router
  ) {}

  getUsers$ = createEffect(() => {
    return this.actions$.pipe(
        ofType(getUsersRequest),
        concatMap(({ queryOptions }) => {
            return this.userService.getUsers(queryOptions).pipe(
                map(({ data }) => {
                    return getUsersSuccess({
                        payload: {
                            data: {
                                content: data.getUsers.content,
                                total: data.getUsers.total
                            },
                            error: '',
                            loading: false
                        }
                    });
                }),
                catchError((err) => {
                    return of(getUsersError({
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

  createUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createUserRequest),
      mergeMap(({ user, queryOptions }) => {
        return this.userService.register(user).pipe(
          mergeMap(({ data }) => {
            return of(
              createUserSuccess({
                payload: {
                  data: data.createUser,
                  error: '',
                  loading: false,
                },
              }),
              getUsersRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              createUserError({
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

  editUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editUserRequest),
      mergeMap(({ id, user, queryOptions }) => {
        return this.userService.editUser(id, user).pipe(
          mergeMap(({ data }) => {
            let actions = [
              editUserSuccess({
                payload: {
                  data: data.editUser,
                  error: '',
                  loading: false,
                },
              }),
            ];

            if (queryOptions) {
              actions.push(getUsersRequest({ queryOptions }) as any);
            }

            return of(...actions);
          }),
          catchError((err) => {
            return of(
              editUserError({
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

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteUserRequest),
      mergeMap(({ id, queryOptions }) => {
        return this.userService.deleteUser(id).pipe(
          mergeMap(({ data }) => {
            return of(
              deleteUserSuccess({
                payload: {
                  data: data.deleteUser,
                  error: '',
                  loading: false,
                },
              }),
              getUsersRequest({ queryOptions })
            );
          }),
          catchError((err) => {
            return of(
              deleteUserError({
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

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginRequest),
      mergeMap(({ email, password }) => {
        return this.userService.login(email, password).pipe(
          mergeMap((data) => {
            return of(
              loginSuccess({
                payload: {
                  data: data.login,
                  error: '',
                  loading: false,
                },
              })
            );
          }),
          catchError((err) => {
            return of(
              loginSuccess({
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

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(registerRequest),
      mergeMap(({ user }) => {
        return this.userService.register(user).pipe(
          mergeMap((data) => {

            this.router.navigate(["/home"]);
            
            return of(
              registerSuccess({
                payload: {
                  data: data.token,
                  error: '',
                  loading: false,
                }
              })
            );
          }),
          catchError((err) => {
            return of(
              registerError({
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
