import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InviteState } from "src/store/app.states";

export const getInviteState = createFeatureSelector<InviteState>('inviteState');

export const getInvites = createSelector(
    getInviteState,
    (state: InviteState) => state.invites
);

export const getInvitesWithTotal = createSelector(
    getInviteState,
    (state: InviteState) => {
        return {
            invites: state.invites,
            total: state.total
        }
    }
);

export const getInviteLoading = createSelector(
    getInviteState,
    (state: InviteState) => state.loading
);

export const getInviteError = createSelector(
    getInviteState,
    (state: InviteState) => state.error
);
