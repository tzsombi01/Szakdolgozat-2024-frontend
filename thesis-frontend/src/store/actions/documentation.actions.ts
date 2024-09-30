import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { DocumentationInput } from "src/models/documentation";
import { QueryOptions } from "src/models/query-options";

export const getDocumentationsRequest = createAction('[ Documentation ] GetDocumentationsRequest', props<{ queryOptions: QueryOptions }>());
export const getDocumentationsSuccess = createAction('[ Documentation ] GetDocumentationsSuccess', props<{ payload: Payload }>());
export const getDocumentationsError = createAction('[ Documentation ] GetDocumentationsError', props<{ payload: Payload }>());

export const getDocumentationRequest = createAction('[ Documentation ] GetDocumentationRequest', props<{ id: string }>());
export const getDocumentationSuccess = createAction('[ Documentation ] GetDocumentationSuccess', props<{ payload: Payload }>());
export const getDocumentationError = createAction('[ Documentation ] GetDocumentationError', props<{ payload: Payload }>());

export const createDocumentationRequest = createAction('[ Documentation ] CreateDocumentationRequest', props<{ documentation: DocumentationInput }>());
export const createDocumentationSuccess = createAction('[ Documentation ] CreateDocumentationSuccess', props<{ payload: Payload }>());
export const createDocumentationError = createAction('[ Documentation ] CreateDocumentationError', props<{ payload: Payload }>());

export const editDocumentationRequest = createAction('[ Documentation ] EditDocumentationRequest', props<{ id: string, documentation: DocumentationInput }>());
export const editDocumentationSuccess = createAction(' [Documentation ] EditDocumentationSuccess', props<{ payload: Payload }>());
export const editDocumentationError = createAction('[ Documentation ] EditDocumentationError', props<{ payload: Payload }>());

export const deleteDocumentationRequest = createAction('[ Documentation ] DeleteDocumentationRequest', props<{ id: string }>());
export const deleteDocumentationSuccess = createAction('[ Documentation ] DeleteDocumentationSuccess', props<{ payload: Payload }>());
export const deleteDocumentationError = createAction('[ Documentation ] DeleteDocumentationError', props<{ payload: Payload }>());
