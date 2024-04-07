import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { DiscussionInput } from "src/models/discussion";
import { QueryOptions } from "src/models/query-options";

export const getDiscussionsRequest = createAction('[ Discussion ] GetDiscussionsRequest', props<{ queryOptions: QueryOptions }>());
export const getDiscussionsSuccess = createAction('[ Discussion ] GetDiscussionsSuccess', props<{ payload: Payload }>());
export const getDiscussionsError = createAction('[ Discussion ] GetDiscussionsError', props<{ payload: Payload }>());

export const getDiscussionRequest = createAction('[ Discussion ] GetDiscussionRequest', props<{ id: string }>());
export const getDiscussionSuccess = createAction('[ Discussion ] GetDiscussionSuccess', props<{ payload: Payload }>());
export const getDiscussionError = createAction('[ Discussion ] GetDiscussionError', props<{ payload: Payload }>());

export const createDiscussionRequest = createAction('[ Discussion ] CreateDiscussionRequest', props<{ discussion: DiscussionInput, queryOptions: QueryOptions }>());
export const createDiscussionSuccess = createAction('[ Discussion ] CreateDiscussionSuccess', props<{ payload: Payload }>());
export const createDiscussionError = createAction('[ Discussion ] CreateDiscussionError', props<{ payload: Payload }>());

export const editDiscussionRequest = createAction('[ Discussion ] EditDiscussionRequest', props<{ id: string, discussion: DiscussionInput, file: any, queryOptions?: QueryOptions }>());
export const editDiscussionSuccess = createAction(' [ Discussion ] EditDiscussionSuccess', props<{ payload: Payload }>());
export const editDiscussionError = createAction('[ Discussion ] EditDiscussionError', props<{ payload: Payload }>());

export const deleteDiscussionRequest = createAction('[ Discussion ] DeleteDiscussionRequest', props<{ id: string, queryOptions: QueryOptions }>());
export const deleteDiscussionSuccess = createAction('[ Discussion ] DeleteDiscussionSuccess', props<{ payload: Payload }>());
export const deleteDiscussionError = createAction('[ Discussion ] DeleteDiscussionError', props<{ payload: Payload }>()); 
