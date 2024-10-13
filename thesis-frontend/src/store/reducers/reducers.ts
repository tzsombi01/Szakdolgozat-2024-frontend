import { Action, ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { AppState } from "../app.states";
import { ticketReducer } from "./ticket.reducer";
import { commentReducer } from "./comment.reducers";
import { discussionReducer } from "./discussion.reducers";
import { documentationReducer } from "./documentation.reducers";
import { userReducer } from "./user.reducer";
import { projectReducer } from "./project.reducers";
import { statisticsReducer } from "./statistics.reducers";
import { statusReducer } from "./status.reducers";
import { inviteReducer } from "./invite.reducers";
import { notificationReducer } from "./notification.reducers";

export const reducers: ActionReducerMap<AppState> = {
    ticketState: ticketReducer,
    commentState: commentReducer,
    discussionState: discussionReducer,
    documentationState: documentationReducer,
    userState: userReducer,
    projectState: projectReducer,
    statisticsState: statisticsReducer,
    statusState: statusReducer,
    inviteState: inviteReducer,
    notificationState: notificationReducer,
};

export function clearState(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return function(state: any, action: Action): AppState {
      return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<any>[] = [clearState];