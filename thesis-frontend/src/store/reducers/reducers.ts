import { Action, ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { AppState } from "../app.states";
import { ticketReducer } from "./ticket.reducer";
import { commentReducer } from "./comment.teducers";

export const reducers: ActionReducerMap<AppState> = {
    ticketState: ticketReducer,
    commentState: commentReducer
};

export function clearState(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return function(state: any, action: Action): AppState {
      return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<any>[] = [clearState];