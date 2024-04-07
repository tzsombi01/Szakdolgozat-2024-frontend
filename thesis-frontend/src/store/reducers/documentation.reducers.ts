import { Action, createReducer, on } from '@ngrx/store';
import { Documentation } from 'src/models/documentation';
import * as documentationActions from 'src/store/actions/documentation.actions';
import { DocumentationState } from 'src/store/app.states';

export const initialState: DocumentationState = {
    documentations: [],
    documentation: ({} as unknown) as Documentation,
    error: '',
    loading: false,
    total: 0
};

const _documentationReducer = createReducer(
    initialState,

    on(documentationActions.getDocumentationsRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(documentationActions.getDocumentationsSuccess, (state, { payload }) => {
        return {
            ...state,
            documentations: payload.data.content,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(documentationActions.getDocumentationsError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(documentationActions.createDocumentationRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(documentationActions.createDocumentationSuccess, (state, { payload }) => {
        return {
            ...state,
            documentations: [
                ...state.documentations,
                (payload.data as unknown) as Documentation
            ],
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(documentationActions.createDocumentationError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(documentationActions.editDocumentationRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(documentationActions.editDocumentationSuccess, (state, { payload }) => {
        let _documentations: Documentation[] = [ ...state.documentations ];
        _documentations[state.documentations.findIndex((documentation: Documentation) => documentation.id === payload.data.id)] = payload.data;
        return {
            ...state,
            documentations: _documentations,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(documentationActions.editDocumentationError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(documentationActions.deleteDocumentationRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(documentationActions.deleteDocumentationSuccess, (state, { payload }) => {
        return {
            ...state,
            documentations: state.documentations.filter((documentation: Documentation) => documentation.id !== payload.data.id),
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(documentationActions.deleteDocumentationError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),
);

export function documentationReducer(state: any, action: Action): DocumentationState {
    return _documentationReducer(state, action);
}
