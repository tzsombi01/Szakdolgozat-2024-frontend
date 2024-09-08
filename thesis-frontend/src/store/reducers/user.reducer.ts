import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/models/user';
import * as userActions from 'src/store/actions/user.actions';
import { UserState } from 'src/store/app.states';

export const initialUserState: UserState = {
    users: [],
    user: ({} as unknown) as User,
    loggedInUser: undefined,
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
            user: payload.data,
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

    on(userActions.loginRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(userActions.loginSuccess, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.loginError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.registerRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(userActions.registerSuccess, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.registerError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.getLoggedInUserRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(userActions.getLoggedInUserSuccess, (state, { payload }) => {
        return {
            ...state,
            loggedInUser: payload.data,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.getLoggedInUserError, (state, { payload }) => {
        return {
            ...state,
            loggedInUser: undefined,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(userActions.logOutRequest, (state) => {
        localStorage.removeItem('token');

        return {
            ...state,
            loggedInUser: undefined,
        };
    }),
);

export function userReducer(state: UserState | undefined, action: Action): UserState {
    return _userReducer(state, action);
}
