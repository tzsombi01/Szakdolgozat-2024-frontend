import { createFeatureSelector, createSelector } from "@ngrx/store";
import { NotificationState } from "src/store/app.states";

export const getNotificationState = createFeatureSelector<NotificationState>('notificationState');

export const getNotifications = createSelector(
    getNotificationState,
    (state: NotificationState) => state.notifications
);

export const getNotificationsWithTotal = createSelector(
    getNotificationState,
    (state: NotificationState) => {
        return {
            notifications: state.notifications,
            total: state.total
        }
    }
);

export const getNotificationLoading = createSelector(
    getNotificationState,
    (state: NotificationState) => state.loading
);

export const getNotificationError = createSelector(
    getNotificationState,
    (state: NotificationState) => state.error
);
