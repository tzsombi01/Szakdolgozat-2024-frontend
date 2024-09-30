import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DiscussionState } from "src/store/app.states";

export const getDiscussionState = createFeatureSelector<DiscussionState>('discussionState');

export const getDiscussions = createSelector(
    getDiscussionState,
    (state: DiscussionState) => state.discussions
);

export const getDiscussionsWithTotal = createSelector(
    getDiscussionState,
    (state: DiscussionState) => {
        return {
            discussions: state.discussions,
            total: state.total
        }
    }
);

export const getDiscussion = createSelector(
    getDiscussionState,
    (state: DiscussionState) => state.discussion
);

export const getDiscussionLoading = createSelector(
    getDiscussionState,
    (state: DiscussionState) => state.loading
);

export const getDiscussionError = createSelector(
    getDiscussionState,
    (state: DiscussionState) => state.error
);
