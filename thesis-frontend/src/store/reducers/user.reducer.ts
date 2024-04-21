import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/models/user'; // Assuming User model is used
import * as userActions from 'src/store/actions/user.actions'; // Importing user actions
import { UserState } from 'src/store/app.states'; // Assuming UserState is defined

export const initialUserState: UserState = {
    users: [],
    user: ({} as unknown) as User,
    loggedInUser: ({} as unknown) as User,
    error: '',
    loading: false,
    total: 0
};

const _userReducer = createReducer(
    initialUserState,

    on(userActions.getUsersRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(userActions.getUsersSuccess, (state, { payload }) => {
        return {
            ...state,
            users: payload.data.content,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.getUsersError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.createUserRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(userActions.createUserSuccess, (state, { payload }) => {
        return {
            ...state,
            users: [
                ...state.users,
                (payload.data as unknown) as User
            ],
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.createUserError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.editUserRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(userActions.editUserSuccess, (state, { payload }) => {
        let _users: User[] = [ ...state.users ];
        _users[state.users.findIndex((user: User) => user.id === payload.data.id)] = payload.data;
        return {
            ...state,
            users: _users,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.editUserError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.deleteUserRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(userActions.deleteUserSuccess, (state, { payload }) => {
        return {
            ...state,
            users: state.users.filter((user: User) => user.id !== payload.data.id),
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.deleteUserError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),
);

export function userReducer(state: UserState | undefined, action: Action): UserState {
    return _userReducer(state, action);
}
