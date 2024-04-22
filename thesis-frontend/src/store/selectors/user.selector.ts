import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "src/store/app.states"; // Assuming UserState is defined

export const getUserState = createFeatureSelector<UserState>('userState'); // Assuming userState is defined in the app state

export const getUsers = createSelector(
    getUserState,
    (state: UserState) => state.users
);

export const getUsersWithTotal = createSelector(
    getUserState,
    (state: UserState) => {
        return {
            users: state.users,
            total: state.total
        }
    }
);

export const getLoggedInUser = createSelector(
    getUserState,
    (state: UserState) => state.loggedInUser
);

export const getToken = createSelector(
    getUserState,
    (state: UserState) => state.token
);

export const getUserLoading = createSelector(
    getUserState,
    (state: UserState) => state.loading
);

export const getUserError = createSelector(
    getUserState,
    (state: UserState) => state.error
);
