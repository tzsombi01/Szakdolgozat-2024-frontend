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
    getLoggedInUserRequest,
    getLoggedInUserSuccess,
    getLoggedInUserError,
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
        concatMap(({ queryOptions, token }) => {
            return this.userService.getUsers(queryOptions, token).pipe(
                map((data) => {
                    return getUsersSuccess({
                        payload: {
                            data: {
                                content: data.getUsers,
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

  editUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editUserRequest),
      mergeMap(({ id, user, queryOptions, token }) => {
        return this.userService.editUser(id, user, token).pipe(
          mergeMap((data) => {
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
              actions.push(getUsersRequest({ queryOptions, token }) as any);
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
      mergeMap(({ id, queryOptions, token }) => {
        return this.userService.deleteUser(id, token).pipe(
          mergeMap((data) => {
            return of(
              deleteUserSuccess({
                payload: {
                  data: data.deleteUser,
                  error: '',
                  loading: false,
                },
              }),
              getUsersRequest({ queryOptions, token })
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

            this.router.navigate(["/home"]);

            return of(
              loginSuccess({
                payload: {
                  data: data.token,
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

  getLoggedInUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getLoggedInUserRequest),
      mergeMap(({ token }) => {
        return this.userService.getLoggedInUser(token).pipe(
          mergeMap((data) => {
            console.log(data);
            
            return of(
              getLoggedInUserSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                }
              })
            );
          }),
          catchError((err) => {
            return of(
              getLoggedInUserError({
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
