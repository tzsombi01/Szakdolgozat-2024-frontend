import { Action, ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { AppState } from "../app.states";
import { ticketReducer } from "./ticket.reducer";
import { commentReducer } from "./comment.teducers";
import { discussionReducer } from "./discussion.reducers";
import { documentationReducer } from "./documentation.reducers";

export const reducers: ActionReducerMap<AppState> = {
    ticketState: ticketReducer,
    commentState: commentReducer,
    discussionState: discussionReducer,
    documentationState: documentationReducer,
};

export function clearState(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return function(state: any, action: Action): AppState {
      return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<any>[] = [clearState];