import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import { Observable } from 'rxjs';
import { Project, ProjectInput } from 'src/models/project';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { createProjectRequest, deleteProjectRequest, editProjectRequest, getProjectsRequest } from 'src/store/actions/project.actions';
import { ProjectState } from 'src/store/app.states';
import { getProjectLoading, getProjectsWithTotal } from 'src/store/selectors/project.selector';

@UntilDestroy()
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  isDialogOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;
  isEdit: boolean = false;

  projectsLoading$: Observable<boolean | any>;

  projects$: Observable<Project[] | any>;
  projects: Project[] = [];
  project?: Project;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  selectedUsers: string[] = [];

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(),
    url: new UntypedFormControl()
  });

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private projectStore: Store<ProjectState>
  ) {
    this.projects$ = this.projectStore.select(getProjectsWithTotal);

    this.projectsLoading$ = this.projectStore.select(getProjectLoading);
  }

  ngOnInit(): void {
    this.onSiteOpen();

    this.projects$.pipe(untilDestroyed(this)).subscribe(({ projects, total }) => {
      this.projects = projects;
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    this.projectStore.dispatch(getProjectsRequest({ queryOptions }));
  }

  open(type: ('create' | 'edit' | 'delete' | 'details'), id?: string): void {
    if (type === 'create') {
      this.isEdit = false;

      this.isDialogOpen = true;
    } else if (type === 'edit') {
      this.isEdit = true;

      this.project = this.projects.find((project: Project) => project.id === id);
      
      this.formGroup.controls['name'].setValue(this.project?.name);
      this.formGroup.controls['url'].setValue(this.project?.url);
      this.selectedUsers = this.project?.users!;
      
      this.isDialogOpen = true;
    } else if (type === 'delete') {
      this.project = this.projects.find((project: Project) => project.id === id);
      
      this.isDeleteDialogOpen = true;
    } else if(type === 'details') {
      this.router.navigate([`/projects/${id}`]);
    }
  }

  close(type: ('cancel' | 'submit' | 'delete')): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    if (type === 'submit') {
      if (!this.isEdit) {
        const newProject: ProjectInput = {
          name: this.formGroup.controls['name'].value,
          url: this.formGroup.controls['url'].value,
          users: this.selectedUsers || [],
          tickets: []
        };

        this.projectStore.dispatch(createProjectRequest({ project: newProject, queryOptions: ({} as Object) as QueryOptions }));
      } else {
        const editedProject: ProjectInput = {
          name: this.formGroup.controls['name'].value,
          url: this.formGroup.controls['url'].value,
          users: this.selectedUsers,
          tickets: this.project?.tickets || []
        };
  
        this.projectStore.dispatch(editProjectRequest({ id: this.project?.id!, project: editedProject, queryOptions: ({} as Object) as QueryOptions }));
      }
    } else if (type === 'delete') {
      this.projectStore.dispatch(deleteProjectRequest({ id: this.project?.id!, queryOptions }));
    }

    this.formGroup.reset();
    this.project = undefined;
    this.isDialogOpen = false;
    this.isDeleteDialogOpen = false;
  }

  isProjectsEmpty(): boolean {
    return this.projects.length === 0;
  }

  getTitle(): string {
    return this.isEdit ? 'Edit Project' : 'Create Project'; 
  }
}
