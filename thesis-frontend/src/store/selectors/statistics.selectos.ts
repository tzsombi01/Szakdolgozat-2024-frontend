import { createFeatureSelector, createSelector } from "@ngrx/store";
import { StatisticsState } from "src/store/app.states";

export const getStatisticsState = createFeatureSelector<StatisticsState>('statisticsState');

export const getProgrammerStatistics = createSelector(
    getStatisticsState,
    (state: StatisticsState) => state.programmerStatistics
);

export const getStatisticsLoading = createSelector(
    getStatisticsState,
    (state: StatisticsState) => state.loading
);

export const getStatisticsError = createSelector(
    getStatisticsState,
    (state: StatisticsState) => state.error
);
