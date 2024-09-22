import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StatusState } from "src/store/app.states";

export const getStatusState = createFeatureSelector<StatusState>('statusState');

export const getStatuses = createSelector(
    getStatusState,
    (state: StatusState) => state.statuses
);

export const getStatus = createSelector(
    getStatusState,
    (state: StatusState) => state.status
);

export const getStatusesWithTotal = createSelector(
    getStatusState,
    (state: StatusState) => {
        return {
            statuses: state.statuses,
            total: state.total
        };
    }
);

export const getStatusLoading = createSelector(
    getStatusState,
    (state: StatusState) => state.loading
);

export const getStatusError = createSelector(
    getStatusState,
    (state: StatusState) => state.error
);
