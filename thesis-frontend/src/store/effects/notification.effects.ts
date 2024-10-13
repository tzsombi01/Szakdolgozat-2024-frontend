import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { NotificationService } from "src/services/notification.service";
import {
  createNotificationError,
  createNotificationRequest,
  createNotificationSuccess,
  editNotificationError,
  editNotificationRequest,
  editNotificationSuccess,
  deleteNotificationError,
  deleteNotificationRequest,
  deleteNotificationSuccess,
  getNotificationsError,
  getNotificationsSuccess,
  getNotificationsRequest,
} from "../actions/notification.actions";
import { catchError, concatMap, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class NotificationEffects {

  constructor(
    private actions$: Actions,
    private notificationService: NotificationService
  ) { }

  getNotifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getNotificationsRequest),
      concatMap(({ queryOptions }) => {

        return this.notificationService.getNotifications(queryOptions).pipe(
          map((data) => {
            return getNotificationsSuccess({
              payload: {
                data: {
                  content: data.content,
                  total: data.numberOfElements
                },
                error: '',
                loading: false
              }
            });
          }),
          catchError((err) => {
            return of(getNotificationsError({
              payload: {
                data: [],
                error: err,
                loading: false
              }
            }));
          })
        );
      })
    );
  });

  createNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createNotificationRequest),
      mergeMap(({ notification }) => {
        return this.notificationService.createNotification(notification).pipe(
          mergeMap((data) => {
            return of(
              createNotificationSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              })
            );
          }),
          catchError((err) => {
            return of(
              createNotificationError({
                payload: {
                  data: [],
                  error: err,
                  loading: false,
                },
              })
            );
          })
        );
      })
    );
  });

  editNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(editNotificationRequest),
      mergeMap(({ id, notification }) => {
        return this.notificationService.editNotification(id, notification).pipe(
          mergeMap((data) => {
            return of(editNotificationSuccess({
              payload: {
                data: data,
                error: '',
                loading: false,
              },
            }));
          }),
          catchError((err) => {
            return of(
              editNotificationError({
                payload: {
                  data: [],
                  error: err,
                  loading: false,
                },
              })
            );
          })
        );
      })
    );
  });

  deleteNotification$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteNotificationRequest),
      mergeMap(({ id }) => {
        return this.notificationService.deleteNotification(id).pipe(
          mergeMap((data) => {
            return of(
              deleteNotificationSuccess({
                payload: {
                  data: data,
                  error: '',
                  loading: false,
                },
              })
            );
          }),
          catchError((err) => {
            return of(
              deleteNotificationError({
                payload: {
                  data: [],
                  error: err,
                  loading: false,
                },
              })
            );
          })
        );
      })
    );
  });
}
