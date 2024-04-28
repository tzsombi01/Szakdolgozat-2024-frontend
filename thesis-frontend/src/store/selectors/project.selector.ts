import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProjectState } from "src/store/app.states";

export const getProjectState = createFeatureSelector<ProjectState>('projectState'); 

export const getProjects = createSelector(
    getProjectState,
    (state: ProjectState) => state.projects
);

export const getProject = createSelector(
    getProjectState,
    (state: ProjectState) => state.project
);

export const getProjectsWithTotal = createSelector(
    getProjectState,
    (state: ProjectState) => {
        return {
            projects: state.projects,
            total: state.total
        }
    }
);

export const getProjectLoading = createSelector(
    getProjectState,
    (state: ProjectState) => state.loading
);

export const getProjectError = createSelector(
    getProjectState,
    (state: ProjectState) => state.error
);
