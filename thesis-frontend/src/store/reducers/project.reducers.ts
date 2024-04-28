import { Action, createReducer, on } from '@ngrx/store';
import { Project } from 'src/models/project'; // Update import to Project model
import * as projectActions from 'src/store/actions/project.actions'; // Update import to project actions
import { ProjectState } from 'src/store/app.states'; // Update import to ProjectState

export const initialState: ProjectState = {
    projects: [],
    project: ({} as unknown) as Project,
    error: '',
    loading: false,
    total: 0
};

const _projectReducer = createReducer(
    initialState,

    on(projectActions.getProjectsRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(projectActions.getProjectsSuccess, (state, { payload }) => {
        return {
            ...state,
            projects: payload.data.content,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(projectActions.getProjectsError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(projectActions.getProjectRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),
    
    on(projectActions.getProjectSuccess, (state, { payload }) => {
        return {
            ...state,
            project: payload.data,
            total: payload.data.total,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(projectActions.getProjectError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(projectActions.createProjectRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(projectActions.createProjectSuccess, (state, { payload }) => {
        return {
            ...state,
            projects: [
                ...state.projects,
                (payload.data as unknown) as Project
            ],
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(projectActions.createProjectError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(projectActions.editProjectRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(projectActions.editProjectSuccess, (state, { payload }) => {
        let _projects: Project[] = [ ...state.projects ];
        _projects[state.projects.findIndex((project: Project) => project.id === payload.data.id)] = payload.data;
        return {
            ...state,
            projects: _projects,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(projectActions.editProjectError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(projectActions.deleteProjectRequest, (state) => {
        return {
            ...state,
            error: '',
            loading: true
        };
    }),

    on(projectActions.deleteProjectSuccess, (state, { payload }) => {
        return {
            ...state,
            projects: state.projects.filter((project: Project) => project.id !== payload.data.id),
            error: payload.error,
            loading: payload.loading
        };
    }),

    on(projectActions.deleteProjectError, (state, { payload }) => {
        return {
            ...state,
            error: payload.error,
            loading: payload.loading
        };
    }),
);

export function projectReducer(state: any, action: Action): ProjectState {
    return _projectReducer(state, action);
}
