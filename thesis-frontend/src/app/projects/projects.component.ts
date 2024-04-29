import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import { Observable } from 'rxjs';
import { Project, ProjectInput } from 'src/models/project';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { createProjectRequest, editProjectRequest, getProjectsRequest } from 'src/store/actions/project.actions';
import { ProjectState } from 'src/store/app.states';
import { getProjectsWithTotal } from 'src/store/selectors/project.selector';

@UntilDestroy()
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  isDialogOpen: boolean = false;
  isEdit: boolean = false;

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
    private http: HttpClient,
    private projectStore: Store<ProjectState>
  ) {
    this.projects$ = this.projectStore.select(getProjectsWithTotal);
  }

  ngOnInit(): void {
    this.onSiteOpen();

    this.projects$.pipe(untilDestroyed(this)).subscribe(({ projects, total }) => {
      console.log(projects)
      console.log(total)
      this.projects = projects;
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent, this.route);

    this.projectStore.dispatch(getProjectsRequest({ queryOptions }));
  }

  open(type: ('create' | 'edit'), id?: string): void {
    if (type === 'create') {
      this.isEdit = false;
    } else if (type === 'edit') {
      this.isEdit = true;

      // Filter selected item!
    }

    this.isDialogOpen = true;
  }

  close(type: ('cancel' | 'submit')): void {
    if (type === 'submit') {
      if (!this.isEdit) {
        const newProject: ProjectInput = {
          name: this.formGroup.controls['name'].value,
          url: this.formGroup.controls['url'].value,
          users: this.selectedUsers,
          tickets: []
        };

        this.projectStore.dispatch(createProjectRequest({ project: newProject, queryOptions: ({} as Object) as QueryOptions }));
      }
    } else {
      const editedProject: ProjectInput = {
        name: this.formGroup.controls['name'].value,
        url: this.formGroup.controls['url'].value,
        users: this.selectedUsers,
        tickets: []
      };

      this.projectStore.dispatch(editProjectRequest({ id: this.project?.id!, project: editedProject, queryOptions: ({} as Object) as QueryOptions }));
    }

    this.formGroup.reset();
    this.isDialogOpen = false;
  }

  isProjectsEmpty(): boolean {
    return this.projects.length === 0;
  }
}
