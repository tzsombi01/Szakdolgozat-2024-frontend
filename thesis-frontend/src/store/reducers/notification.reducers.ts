import { Action, createReducer, on } from '@ngrx/store';
import { Notification } from 'src/models/notification';
import * as notificationActions from 'src/store/actions/notification.actions';
import { NotificationState } from 'src/store/app.states'; 

export const initialNotificationState: NotificationState = {
    notifications: [],
    notification: ({} as unknown) as Notification,
    error: '',
    loading: false,
    total: 0
};

const _notificationReducer = createReducer(
    initialNotificationState,

    on(notificationActions.getNotificationsRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(notificationActions.getNotificationsSuccess, (state, { payload }) => {
        return {
            ...state,
            notifications: payload.data.content,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(notificationActions.getNotificationsError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(notificationActions.createNotificationRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(notificationActions.createNotificationSuccess, (state, { payload }) => {
        return {
            ...state,
            notifications: [
                ...state.notifications,
                (payload.data as unknown) as Notification
            ],
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(notificationActions.createNotificationError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(notificationActions.editNotificationRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(notificationActions.editNotificationSuccess, (state, { payload }) => {
        let _notifications: Notification[] = [ ...state.notifications ];
        _notifications[state.notifications.findIndex((notification: Notification) => notification.id === payload.data.id)] = payload.data;
        return {
            ...state,
            notifications: _notifications,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(notificationActions.editNotificationError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(notificationActions.deleteNotificationRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(notificationActions.deleteNotificationSuccess, (state, { payload }) => {
        return {
            ...state,
            notifications: state.notifications.filter((notification: Notification) => notification.id !== payload.data.id),
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(notificationActions.deleteNotificationError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),
);

export function notificationReducer(state: NotificationState | undefined, action: Action): NotificationState {
    return _notificationReducer(state, action);
}
