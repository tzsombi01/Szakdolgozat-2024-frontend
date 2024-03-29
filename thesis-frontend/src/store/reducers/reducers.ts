import { Action, ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { AppState } from "../app.states";

export const reducers: ActionReducerMap<AppState> = {
    
};

export function clearState(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return function(state: any, action: Action): AppState {
      return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<any>[] = [clearState];