import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { UserInput } from "src/models/user";
import { QueryOptions } from "src/models/query-options";

export const getUsersRequest = createAction('[ User ] GetUsersRequest', props<{ queryOptions: QueryOptions }>());
export const getUsersSuccess = createAction('[ User ] GetUsersSuccess', props<{ payload: Payload }>());
export const getUsersError = createAction('[ User ] GetUsersError', props<{ payload: Payload }>());

export const getUserRequest = createAction('[ User ] GetUserRequest', props<{ id: string }>());
export const getUserSuccess = createAction('[ User ] GetUserSuccess', props<{ payload: Payload }>());
export const getUserError = createAction('[ User ] GetUserError', props<{ payload: Payload }>());

export const createUserRequest = createAction('[ User ] CreateUserRequest', props<{ user: UserInput, queryOptions: QueryOptions }>());
export const createUserSuccess = createAction('[ User ] CreateUserSuccess', props<{ payload: Payload }>());
export const createUserError = createAction('[ User ] CreateUserError', props<{ payload: Payload }>());

export const editUserRequest = createAction('[ User ] EditUserRequest', props<{ id: string, user: UserInput, queryOptions?: QueryOptions }>());
export const editUserSuccess = createAction('[ User ] EditUserSuccess', props<{ payload: Payload }>());
export const editUserError = createAction('[ User ] EditUserError', props<{ payload: Payload }>());

export const deleteUserRequest = createAction('[ User ] DeleteUserRequest', props<{ id: string, queryOptions: QueryOptions }>());
export const deleteUserSuccess = createAction('[ User ] DeleteUserSuccess', props<{ payload: Payload }>());
export const deleteUserError = createAction('[ User ] DeleteUserError', props<{ payload: Payload }>());
