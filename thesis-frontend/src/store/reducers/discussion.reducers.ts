import { Action, createReducer, on } from '@ngrx/store';
import { Discussion } from 'src/models/discussion';
import * as discussionActions from 'src/store/actions/discussion.actions';
import { DiscussionState } from 'src/store/app.states';

export const initialState: DiscussionState = {
    discussions: [],
    discussion: ({} as unknown) as Discussion,
    error: '',
    loading: false,
    total: 0
};

const _discussionReducer = createReducer(
    initialState,

    on(discussionActions.getDiscussionsRequest, (state) => ({
        ...state,
        error: '',
        loading: true
    })),

    on(discussionActions.getDiscussionsSuccess, (state, { payload }) => ({
        ...state,
        discussions: payload.data.content,
        total: payload.data.total,
        error: payload.error,
        loading: payload.loading
    })),

    on(discussionActions.getDiscussionsError, (state, { payload }) => ({
        ...state,
        error: payload.error,
        loading: payload.loading
    })),

    on(discussionActions.getDiscussionRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(discussionActions.getDiscussionSuccess, (state, { payload }) => {
        return {
            ...state,
            discussion: payload.data,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(discussionActions.getDiscussionError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(discussionActions.createDiscussionRequest, (state) => ({
        ...state,
        error: '',
        loading: true
    })),

    on(discussionActions.createDiscussionSuccess, (state, { payload }) => ({
        ...state,
        discussions: [
            ...state.discussions,
            (payload.data as unknown) as Discussion
        ],
        error: payload.error,
        loading: payload.loading
    })),

    on(discussionActions.createDiscussionError, (state, { payload }) => ({
        ...state,
        error: payload.error,
        loading: payload.loading
    })),

    on(discussionActions.editDiscussionRequest, (state) => ({
        ...state,
        error: '',
        loading: true
    })),

    on(discussionActions.editDiscussionSuccess, (state, { payload }) => {
        const discussions = [...state.discussions];
        const index = discussions.findIndex((discussion: Discussion) => discussion.id === payload.data.id);
        if (index !== -1) {
            discussions[index] = payload.data;
        }
        return {
            ...state,
            discussions,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(discussionActions.editDiscussionError, (state, { payload }) => ({
        ...state,
        error: payload.error,
        loading: payload.loading
    })),

    on(discussionActions.deleteDiscussionRequest, (state) => ({
        ...state,
        error: '',
        loading: true
    })),

    on(discussionActions.deleteDiscussionSuccess, (state, { payload }) => ({
        ...state,
        discussions: state.discussions.filter((discussion: Discussion) => discussion.id !== payload.data.id),
        error: payload.error,
        loading: payload.loading
    })),

    on(discussionActions.deleteDiscussionError, (state, { payload }) => ({
        ...state,
        error: payload.error,
        loading: payload.loading
    })),
);

export function discussionReducer(state: any, action: Action): DiscussionState {
    return _discussionReducer(state, action);
}
