import { createAction, props } from "@ngrx/store";
import { Payload } from "../models";
import { NotificationInput } from "src/models/notification"; // Updated from CommentInput
import { QueryOptions } from "src/models/query-options";

export const getNotificationsRequest = createAction('[ Notification ] GetNotificationsRequest', props<{ queryOptions: QueryOptions }>());
export const getNotificationsSuccess = createAction('[ Notification ] GetNotificationsSuccess', props<{ payload: Payload }>());
export const getNotificationsError = createAction('[ Notification ] GetNotificationsError', props<{ payload: Payload }>());

export const getNotificationRequest = createAction('[ Notification ] GetNotificationRequest', props<{ id: string }>());
export const getNotificationSuccess = createAction('[ Notification ] GetNotificationSuccess', props<{ payload: Payload }>());
export const getNotificationError = createAction('[ Notification ] GetNotificationError', props<{ payload: Payload }>());

export const createNotificationRequest = createAction('[ Notification ] CreateNotificationRequest', props<{ notification: NotificationInput }>()); // Updated from comment: CommentInput
export const createNotificationSuccess = createAction('[ Notification ] CreateNotificationSuccess', props<{ payload: Payload }>());
export const createNotificationError = createAction('[ Notification ] CreateNotificationError', props<{ payload: Payload }>());

export const editNotificationRequest = createAction('[ Notification ] EditNotificationRequest', props<{ id: string, notification: NotificationInput }>());
export const editNotificationSuccess = createAction('[ Notification ] EditNotificationSuccess', props<{ payload: Payload }>());
export const editNotificationError = createAction('[ Notification ] EditNotificationError', props<{ payload: Payload }>());

export const deleteNotificationRequest = createAction('[ Notification ] DeleteNotificationRequest', props<{ id: string }>());
export const deleteNotificationSuccess = createAction('[ Notification ] DeleteNotificationSuccess', props<{ payload: Payload }>());
export const deleteNotificationError = createAction('[ Notification ] DeleteNotificationError', props<{ payload: Payload }>());
