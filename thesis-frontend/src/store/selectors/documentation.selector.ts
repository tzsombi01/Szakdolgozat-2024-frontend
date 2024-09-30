import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DocumentationState } from "src/store/app.states";

export const getDocumentationState = createFeatureSelector<DocumentationState>('documentationState');

export const getDocumentations = createSelector(
    getDocumentationState,
    (state: DocumentationState) => state.documentations
);

export const getDocumentationsWithTotal = createSelector(
    getDocumentationState,
    (state: DocumentationState) => {
        return {
            documentations: state.documentations,
            total: state.total
        }
    }
);

export const getDocumentation = createSelector(
    getDocumentationState,
    (state: DocumentationState) => state.documentation
);

export const getDocumentationLoading = createSelector(
    getDocumentationState,
    (state: DocumentationState) => state.loading
);

export const getDocumentationError = createSelector(
    getDocumentationState,
    (state: DocumentationState) => state.error
);
