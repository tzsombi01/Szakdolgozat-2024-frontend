import { Action, createReducer, on } from '@ngrx/store';
import { ProgrammerStatisticsResponse } from 'src/models/programmer-statistics';
import * as statisticsActions from 'src/store/actions/statistics.actions';
import { StatisticsState } from 'src/store/app.states';

export const initialState: StatisticsState = {
    programmerStatistics: [],
    error: '',
    loading: false,
    total: 0
};

const _statisticsReducer = createReducer(
    initialState,

    on(statisticsActions.getProgrammerStatisticsRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(statisticsActions.getProgrammerStatisticsSuccess, (state, { payload }) => {
        const _programmerStatistics: ProgrammerStatisticsResponse[] = [ ...state.programmerStatistics ];
        
        if (_programmerStatistics.find(statistics => statistics.type === payload.data.type)?.type) {
            _programmerStatistics[state.programmerStatistics.findIndex((statistics: ProgrammerStatisticsResponse) => statistics.type === payload.data.type)] = payload.data;
        } else {
            _programmerStatistics.push(payload.data);
        }

        return {
            ...state,
            programmerStatistics: _programmerStatistics,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statisticsActions.getProgrammerStatisticsError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statisticsActions.clearStatisticsState, (state) => {
        return {
            programmerStatistics: [],
            error: '',
            loading: false,
            total: 0
        };
    }),
);

export function statisticsReducer(state: any, action: Action): StatisticsState {
    return _statisticsReducer(state, action);
}
