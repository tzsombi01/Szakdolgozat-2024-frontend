import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CommentState } from "src/store/app.states";

export const getCommentState = createFeatureSelector<CommentState>('commentState');

export const getComments = createSelector(
    getCommentState,
    (state: CommentState) => state.comments
);

export const getCommentsWithTotal = createSelector(
    getCommentState,
    (state: CommentState) => {
        return {
            comments: state.comments,
            total: state.total
        }
    }
);

export const getCommentLoading = createSelector(
    getCommentState,
    (state: CommentState) => state.loading
);

export const getCommentError = createSelector(
    getCommentState,
    (state: CommentState) => state.error
);
