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

export const acceptInviteRequest = createAction('[ Invite ] AcceptInviteRequest', props<{ id: string }>());
export const acceptInviteSuccess = createAction('[ Invite ] AcceptInviteSuccess', props<{ payload: Payload }>());
export const acceptInviteError = createAction('[ Invite ] AcceptInviteError', props<{ payload: Payload }>());

export const editInviteRequest = createAction('[ Invite ] EditInviteRequest', props<{ id: string, invite: InviteInput }>());
export const editInviteSuccess = createAction('[ Invite ] EditInviteSuccess', props<{ payload: Payload }>());
export const editInviteError = createAction('[ Invite ] EditInviteError', props<{ payload: Payload }>());

export const declineInviteRequest = createAction('[ Invite ] DeclineInviteRequest', props<{ id: string }>());
export const declineInviteSuccess = createAction('[ Invite ] DeclineInviteSuccess', props<{ payload: Payload }>());
export const declineInviteError = createAction('[ Invite ] DeclineInviteError', props<{ payload: Payload }>());
