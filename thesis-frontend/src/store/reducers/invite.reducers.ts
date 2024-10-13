import { Action, createReducer, on } from '@ngrx/store';
import { Invite } from 'src/models/invite';
import * as inviteActions from 'src/store/actions/invite.actions';
import { InviteState } from 'src/store/app.states';

export const initialInviteState: InviteState = {
    invites: [],
    invite: ({} as unknown) as Invite, 
    error: '',
    loading: false,
    total: 0
};

const _inviteReducer = createReducer(
    initialInviteState,

    on(inviteActions.getInvitesRequest, (state) => { 
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(inviteActions.getInvitesSuccess, (state, { payload }) => {
        return {
            ...state,
            invites: payload.data.content,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(inviteActions.getInvitesError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(inviteActions.createInviteRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(inviteActions.createInviteSuccess, (state, { payload }) => { 
        return {
            ...state,
            invites: [
                ...state.invites,
                (payload.data as unknown) as Invite
            ],
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(inviteActions.createInviteError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(inviteActions.editInviteRequest, (state) => { 
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(inviteActions.editInviteSuccess, (state, { payload }) => {
        let _invites: Invite[] = [ ...state.invites ];
        _invites[state.invites.findIndex((invite: Invite) => invite.id === payload.data.id)] = payload.data;
        return {
            ...state,
            invites: _invites,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(inviteActions.editInviteError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(inviteActions.deleteInviteRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(inviteActions.deleteInviteSuccess, (state, { payload }) => {
        return {
            ...state,
            invites: state.invites.filter((invite: Invite) => invite.id !== payload.data.id),
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(inviteActions.deleteInviteError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),
);

export function inviteReducer(state: InviteState | undefined, action: Action): InviteState {
    return _inviteReducer(state, action);
}
