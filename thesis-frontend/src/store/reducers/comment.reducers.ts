import { Action, createReducer, on } from '@ngrx/store';
import { Comment } from 'src/models/comment';
import * as commentActions from 'src/store/actions/comment.actions';
import { CommentState } from 'src/store/app.states'; 

export const initialCommentState: CommentState = {
    comments: [],
    comment: ({} as unknown) as Comment,
    error: '',
    loading: false,
    total: 0
};

const _commentReducer = createReducer(
    initialCommentState,

    on(commentActions.getCommentsRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(commentActions.getCommentsSuccess, (state, { payload }) => {
        return {
            ...state,
            comments: payload.data.content,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(commentActions.getCommentsError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(commentActions.createCommentRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(commentActions.createCommentSuccess, (state, { payload }) => {
        return {
            ...state,
            comments: [
                ...state.comments,
                (payload.data as unknown) as Comment
            ],
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(commentActions.createCommentError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(commentActions.editCommentRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(commentActions.editCommentSuccess, (state, { payload }) => {
        let _comments: Comment[] = [ ...state.comments ];
        _comments[state.comments.findIndex((comment: Comment) => comment.id === payload.data.id)] = payload.data;
        return {
            ...state,
            comments: _comments,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(commentActions.editCommentError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(commentActions.deleteCommentRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(commentActions.deleteCommentSuccess, (state, { payload }) => {
        return {
            ...state,
            comments: state.comments.filter((comment: Comment) => comment.id !== payload.data.id),
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(commentActions.deleteCommentError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),
);

export function commentReducer(state: CommentState | undefined, action: Action): CommentState {
    return _commentReducer(state, action);
}
