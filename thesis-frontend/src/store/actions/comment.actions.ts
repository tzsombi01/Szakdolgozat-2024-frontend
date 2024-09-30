import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { CommentInput } from "src/models/comment";
import { QueryOptions } from "src/models/query-options";

export const getCommentsRequest = createAction('[ Comment ] GetCommentsRequest', props<{ queryOptions: QueryOptions }>());
export const getCommentsSuccess = createAction('[ Comment ] GetCommentsSuccess', props<{ payload: Payload }>());
export const getCommentsError = createAction('[ Comment ] GetCommentsError', props<{ payload: Payload }>());

export const getCommentRequest = createAction('[ Comment ] GetCommentRequest', props<{ id: string }>());
export const getCommentSuccess = createAction('[ Comment ] GetCommentSuccess', props<{ payload: Payload }>());
export const getCommentError = createAction('[ Comment ] GetCommentError', props<{ payload: Payload }>());

export const createCommentRequest = createAction('[ Comment ] CreateCommentRequest', props<{ comment: CommentInput }>());
export const createCommentSuccess = createAction('[ Comment ] CreateCommentSuccess', props<{ payload: Payload }>());
export const createCommentError = createAction('[ Comment ] CreateCommentError', props<{ payload: Payload }>());

export const editCommentRequest = createAction('[ Comment ] EditCommentRequest', props<{ id: string, comment: CommentInput }>());
export const editCommentSuccess = createAction('[ Comment ] EditCommentSuccess', props<{ payload: Payload }>());
export const editCommentError = createAction('[ Comment ] EditCommentError', props<{ payload: Payload }>());

export const deleteCommentRequest = createAction('[ Comment ] DeleteCommentRequest', props<{ id: string }>());
export const deleteCommentSuccess = createAction('[ Comment ] DeleteCommentSuccess', props<{ payload: Payload }>());
export const deleteCommentError = createAction('[ Comment ] DeleteCommentError', props<{ payload: Payload }>());

