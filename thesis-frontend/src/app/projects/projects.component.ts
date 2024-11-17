import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import { Observable } from 'rxjs';
import { Invite } from 'src/models/invite';
import { Project, ProjectInput } from 'src/models/project';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { acceptInviteRequest, declineInviteRequest, getInvitesRequest } from 'src/store/actions/invite.actions';
import { createProjectRequest, deleteProjectRequest, editProjectRequest, getProjectsByIdsRequest, getProjectsRequest, leaveProjectRequest } from 'src/store/actions/project.actions';
import { InviteState, ProjectState } from 'src/store/app.states';
import { getInvitesWithTotal } from 'src/store/selectors/invite.selector';
import { getProjectLoading, getProjectsByIds, getProjectsWithTotal } from 'src/store/selectors/project.selector';

@UntilDestroy()
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  isDialogOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;
  isLeaveDialogOpen: boolean = false;
  isEdit: boolean = false;

  projectsLoading$: Observable<boolean | any>;

  projects$: Observable<Project[] | any>;
  projects: Project[] = [];
  projectsByIds$: Observable<Project[] | any>;
  projectsByIds: Project[] = [];
  project?: Project;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  invites$: Observable<Invite[] | any>;
  invites: Invite[] = [];
  invite?: Invite;
  inviteGridState: State = {
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
    private projectStore: Store<ProjectState>,
    private inviteStore: Store<InviteState>,
  ) {
    this.projects$ = this.projectStore.select(getProjectsWithTotal);
    this.projectsByIds$ = this.projectStore.select(getProjectsByIds);
    this.invites$ = this.inviteStore.select(getInvitesWithTotal);

    this.projectsLoading$ = this.projectStore.select(getProjectLoading);
  }

  ngOnInit(): void {
    this.onSiteOpen();

    this.projects$.pipe(untilDestroyed(this)).subscribe(({ projects, total }) => {
      this.projects = projects;
    });

    this.projectsByIds$.pipe(untilDestroyed(this)).subscribe((projectsByIds) => {
      this.projectsByIds = projectsByIds;
    });
    
    this.invites$.pipe(untilDestroyed(this)).subscribe(({ invites, total }) => {
      this.invites = invites;
      if (this.invites.length > 0) {
        this.projectStore.dispatch(getProjectsByIdsRequest({ ids: this.invites.map(invite => invite.project) }));
      }
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    this.projectStore.dispatch(getProjectsRequest({ queryOptions }));
    this.inviteStore.dispatch(getInvitesRequest({ queryOptions }));
  }

  open(type: ('create' | 'edit' | 'delete' | 'details' | 'leave'), id?: string): void {
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
    } else if (type === 'leave') {
      this.project = this.projects.find((project: Project) => project.id === id);

      this.isLeaveDialogOpen = true;
    }
  }

  close(type: ('cancel' | 'submit' | 'delete' | 'accept' | 'decline' | 'leave'), id?: string): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    if (type === 'submit') {
      if (!this.isEdit) {
        const newProject: ProjectInput = {
          name: this.formGroup.controls['name'].value,
          url: this.formGroup.controls['url'].value,
          users: this.selectedUsers || [],
          tickets: []
        };

        this.projectStore.dispatch(createProjectRequest({ project: newProject, queryOptions }));
      } else {
        const editedProject: ProjectInput = {
          name: this.formGroup.controls['name'].value,
          url: this.formGroup.controls['url'].value,
          users: this.selectedUsers,
          tickets: this.project?.tickets || []
        };
  
        this.projectStore.dispatch(editProjectRequest({ id: this.project?.id!, project: editedProject, queryOptions }));
      }
    } else if (type === 'delete') {
      this.projectStore.dispatch(deleteProjectRequest({ id: this.project?.id!, queryOptions }));
    } else if (type === 'accept') {
      this.inviteStore.dispatch(acceptInviteRequest({ id: id! }));
    } else if (type === 'decline') {
      this.inviteStore.dispatch(declineInviteRequest({ id: id! }));
    } else if (type === 'leave') {
      this.projectStore.dispatch(leaveProjectRequest({ id: this.project?.id!, queryOptions }));
    }

    this.formGroup.reset();
    this.project = undefined;
    this.isDialogOpen = false;
    this.isDeleteDialogOpen = false;
    this.isLeaveDialogOpen = false;
    
    this.onSiteOpen();
  }

  isProjectsEmpty(): boolean {
    return this.projects.length === 0;
  }
  
  isProjectInvitesEmpty(): boolean {
    return this.invites.length === 0;
  }
  
  getProjectName(id: string): string {
    return this.projectsByIds.find(project => project.id === id)!.name;
  }

  getTitle(): string {
    return this.isEdit ? 'Edit Project' : 'Create Project'; 
  }
}
