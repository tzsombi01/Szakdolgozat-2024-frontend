import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { StatusInput } from "src/models/status";
import { QueryOptions } from "src/models/query-options";

export const getStatusesRequest = createAction('[ Status ] GetStatusesRequest', props<{ queryOptions: QueryOptions }>());
export const getStatusesSuccess = createAction('[ Status ] GetStatusesSuccess', props<{ payload: Payload }>());
export const getStatusesError = createAction('[ Status ] GetStatusesError', props<{ payload: Payload }>());

export const getStatusRequest = createAction('[ Status ] GetStatusRequest', props<{ id: string }>());
export const getStatusSuccess = createAction('[ Status] GetStatusSuccess', props<{ payload: Payload }>());
export const getStatusError = createAction('[ Status ] GetStatusError', props<{ payload: Payload }>());

export const createStatusRequest = createAction('[ Status ] CreateStatusRequest', props<{ status: StatusInput, queryOptions: QueryOptions }>());
export const createStatusSuccess = createAction('[ Status ] CreateStatusSuccess', props<{ payload: Payload }>());
export const createStatusError = createAction('[ Status ] CreateStatusError', props<{ payload: Payload }>());

export const editStatusRequest = createAction('[ Status ] EditStatusRequest', props<{ id: string, status: StatusInput, queryOptions?: QueryOptions }>());
export const editStatusSuccess = createAction('[ Status ] EditStatusSuccess', props<{ payload: Payload }>());
export const editStatusError = createAction('[ Status ] EditStatusError', props<{ payload: Payload }>());

export const deleteStatusRequest = createAction('[ Status ] DeleteStatusRequest', props<{ id: string, queryOptions: QueryOptions }>());
export const deleteStatusSuccess = createAction('[ Status ] DeleteStatusSuccess', props<{ payload: Payload }>());
export const deleteStatusError = createAction('[ Status ] DeleteStatusError', props<{ payload: Payload }>());

export const clearStatusState = createAction('[ Status ] ClearStatusState');
