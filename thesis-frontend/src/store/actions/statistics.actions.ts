import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { ProgrammerStatisticsRequest } from "src/models/programmer-statistics";

export const getProgrammerStatisticsRequest = createAction('[ Statistics ] GetProgrammerStatisticsRequest', props<{ projectId: string; programmerStatisticsRequest: ProgrammerStatisticsRequest; }>());
export const getProgrammerStatisticsSuccess = createAction('[ Statistics ] GetProgrammerStatisticsSuccess', props<{ payload: Payload }>());
export const getProgrammerStatisticsError = createAction('[ Statistics ] GetProgrammerStatisticsError', props<{ payload: Payload }>());

export const clearStatisticsState = createAction('[ Statistics ] ClearStatisticsState');