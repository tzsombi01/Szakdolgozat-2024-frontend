import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { ProjectInput } from "src/models/project";
import { QueryOptions } from "src/models/query-options";

export const getProjectsRequest = createAction('[ Project ] GetProjectsRequest', props<{ queryOptions: QueryOptions }>());
export const getProjectsSuccess = createAction('[ Project ] GetProjectsSuccess', props<{ payload: Payload }>());
export const getProjectsError = createAction('[ Project ] GetProjectsError', props<{ payload: Payload }>());

export const getProjectRequest = createAction('[ Project ] GetProjectRequest', props<{ id: string }>());
export const getProjectSuccess = createAction('[ Project] GetProjectSuccess', props<{ payload: Payload }>());
export const getProjectError = createAction('[ Project ] GetProjectError', props<{ payload: Payload }>());

export const getProjectsByIdsRequest = createAction('[ Project ] GetProjectsByIdsRequest', props<{ ids: string[]; }>());
export const getProjectsByIdsSuccess = createAction('[ Project ] GetProjectsByIdsSuccess', props<{ payload: Payload }>());
export const getProjectsByIdsError = createAction('[ Project ] getProjectsByIdsError', props<{ payload: Payload }>());

export const createProjectRequest = createAction('[ Project ] CreateProjectRequest', props<{ project: ProjectInput, queryOptions: QueryOptions }>());
export const createProjectSuccess = createAction('[ Project ] CreateProjectSuccess', props<{ payload: Payload }>());
export const createProjectError = createAction('[ Project ] CreateProjectError', props<{ payload: Payload }>());

export const editProjectRequest = createAction('[ Project ] EditProjectRequest', props<{ id: string, project: ProjectInput, queryOptions?: QueryOptions }>());
export const editProjectSuccess = createAction(' [Project ] EditProjectSuccess', props<{ payload: Payload }>());
export const editProjectError = createAction('[ Project ] EditProjectError', props<{ payload: Payload }>());

export const deleteProjectRequest = createAction('[ Project ] DeleteProjectRequest', props<{ id: string, queryOptions: QueryOptions }>());
export const deleteProjectSuccess = createAction('[ Project ] DeleteProjectSuccess', props<{ payload: Payload }>());
export const deleteProjectError = createAction('[ Project ] DeleteProjectError', props<{ payload: Payload }>()); 

export const leaveProjectRequest = createAction('[ Project ] LeaveProjectRequest', props<{ id: string, queryOptions: QueryOptions }>());
export const leaveProjectSuccess = createAction('[ Project ] LeaveProjectSuccess', props<{ payload: Payload }>());
export const leaveProjectError = createAction('[ Project ] LeaveProjectError', props<{ payload: Payload }>()); 
