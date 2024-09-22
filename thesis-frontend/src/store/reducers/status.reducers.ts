import { Action, createReducer, on } from '@ngrx/store';
import { Status } from 'src/models/status';
import * as statusActions from 'src/store/actions/status.actions';
import { StatusState } from 'src/store/app.states';

export const initialState: StatusState = {
    statuses: [],
    status: ({} as unknown) as Status,
    error: '',
    loading: false,
    total: 0
};

const _statusReducer = createReducer(
    initialState,

    on(statusActions.getStatusesRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(statusActions.getStatusesSuccess, (state, { payload }) => {
        return {
            ...state,
            statuses: payload.data.content,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.getStatusesError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.getStatusRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(statusActions.getStatusSuccess, (state, { payload }) => {
        return {
            ...state,
            status: payload.data,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.getStatusError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.createStatusRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(statusActions.createStatusSuccess, (state, { payload }) => {
        return {
            ...state,
            statuses: [
                ...state.statuses,
                (payload.data as unknown) as Status
            ],
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.createStatusError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.editStatusRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(statusActions.editStatusSuccess, (state, { payload }) => {
        let _statuses: Status[] = [ ...state.statuses ];
        _statuses[state.statuses.findIndex((status: Status) => status.id === payload.data.id)] = payload.data;
        return {
            ...state,
            statuses: _statuses,
            status: payload.data,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.editStatusError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.deleteStatusRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(statusActions.deleteStatusSuccess, (state, { payload }) => {
        return {
            ...state,
            statuses: state.statuses.filter((status: Status) => status.id !== payload.data.id),
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.deleteStatusError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(statusActions.clearStatusState, (state) => {
        return {
            statuses: [],
            status: ({} as unknown) as Status, 
            error: '',
            loading: false,
            total: 0
        };
    }),
);

export function statusReducer(state: any, action: Action): StatusState {
    return _statusReducer(state, action);
}
