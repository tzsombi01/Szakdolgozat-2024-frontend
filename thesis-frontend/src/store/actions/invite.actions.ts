import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { InviteInput } from "src/models/invite";
import { QueryOptions } from "src/models/query-options";

export const getInvitesRequest = createAction('[ Invite ] GetInvitesRequest', props<{ queryOptions: QueryOptions }>());
export const getInvitesSuccess = createAction('[ Invite ] GetInvitesSuccess', props<{ payload: Payload }>());
export const getInvitesError = createAction('[ Invite ] GetInvitesError', props<{ payload: Payload }>());

export const getInviteRequest = createAction('[ Invite ] GetInviteRequest', props<{ id: string }>());
export const getInviteSuccess = createAction('[ Invite ] GetInviteSuccess', props<{ payload: Payload }>());
export const getInviteError = createAction('[ Invite ] GetInviteError', props<{ payload: Payload }>());

export const createInviteRequest = createAction('[ Invite ] CreateInviteRequest', props<{ invite: InviteInput }>()); // Updated from comment: CommentInput
export const createInviteSuccess = createAction('[ Invite ] CreateInviteSuccess', props<{ payload: Payload }>());
export const createInviteError = createAction('[ Invite ] CreateInviteError', props<{ payload: Payload }>());

export const editInviteRequest = createAction('[ Invite ] EditInviteRequest', props<{ id: string, invite: InviteInput }>());
export const editInviteSuccess = createAction('[ Invite ] EditInviteSuccess', props<{ payload: Payload }>());
export const editInviteError = createAction('[ Invite ] EditInviteError', props<{ payload: Payload }>());

export const deleteInviteRequest = createAction('[ Invite ] DeleteInviteRequest', props<{ id: string }>());
export const deleteInviteSuccess = createAction('[ Invite ] DeleteInviteSuccess', props<{ payload: Payload }>());
export const deleteInviteError = createAction('[ Invite ] DeleteInviteError', props<{ payload: Payload }>());
