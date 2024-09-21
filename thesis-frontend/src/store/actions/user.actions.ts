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

export const registerRequest = createAction('[ User ] RegisterRequest', props<{ user: UserInput }>());
export const registerSuccess = createAction('[ User ] RegisterSuccess', props<{ payload: Payload }>());
export const registerError = createAction('[ User ] RegisterError', props<{ payload: Payload }>());

export const loginRequest = createAction('[ User ] LoginRequest', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[ User ] LoginSuccess', props<{ payload: Payload }>());
export const loginError = createAction('[ User ] LoginError', props<{ payload: Payload }>());

export const getLoggedInUserRequest = createAction('[ User ] GetLoggedInUserRequest');
export const getLoggedInUserSuccess = createAction('[ User ] GetLoggedInUserSuccess', props<{ payload: Payload }>());
export const getLoggedInUserError = createAction('[ User ] GetLoggedInUserError', props<{ payload: Payload }>());

export const setAccessTokenRequest = createAction('[ User ] SetAccessTokenRequest', props<{ accessToken: string; }>());
export const setAccessTokenSuccess = createAction('[ User ] SetAccessTokenSuccess', props<{ payload: Payload }>());
export const setAccessTokenError = createAction('[ User ] SetAccessTokenError', props<{ payload: Payload }>());

export const sendInviteToEmailsRequest = createAction('[ User ] SendInviteToEmailsRequest', props<{ projectId: string; emails: string[]; }>());
export const sendInviteToEmailsSuccess = createAction('[ User ] SendInviteToEmailsSuccess');
export const sendInviteToEmailsError = createAction('[ User ] SendInviteToEmailsError', props<{ payload: Payload }>());

export const logOutRequest = createAction('[ User ] LogOutRequest');
