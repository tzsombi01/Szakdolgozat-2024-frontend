import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Discussion, DiscussionInput } from 'src/models/discussion';
import { DiscussionState, ProjectState, UserState } from 'src/store/app.states';
import { State } from '@progress/kendo-data-query';
import { getDiscussionLoading, getDiscussionsWithTotal } from 'src/store/selectors/discussion.selector';
import { createDiscussionRequest, deleteDiscussionRequest, editDiscussionRequest, getDiscussionsRequest } from 'src/store/actions/discussion.actions';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/models/project';
import { User } from 'src/models/user';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { getUsersRequest } from 'src/store/actions/user.actions';
import { getProject } from 'src/store/selectors/project.selector';
import { getUsers, getUserLoading } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {

  projectId?: string;

  isDialogOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;
  isEdit: boolean = false;

  discussionsLoading$: Observable<boolean | any>;

  discussions$: Observable<Discussion[] | any>;
  discussions: Discussion[] = [];
  discussion?: Discussion;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  project$: Observable<Project | any>;
  project: Project | undefined;

  users$: Observable<User[] | any>;
  users: User[] = [];
  usersLoading$: Observable<boolean | any>;

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(),
    description: new UntypedFormControl(),
  });

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
    private discussionStore: Store<DiscussionState>,
    private projectStore: Store<ProjectState>,
    private userStore: Store<UserState>,
  ) {
    this.discussions$ = this.discussionStore.select(getDiscussionsWithTotal);
    this.project$ = this.projectStore.select(getProject);
    this.users$ = this.userStore.select(getUsers);
    
    this.discussionsLoading$ = this.discussionStore.select(getDiscussionLoading);
    this.usersLoading$ = this.userStore.select(getUserLoading);
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.projectId = params.get('id') ?? '';

      if (!this.projectId) {
        this.snackBar.open('No project ID provided', 'Close', {
          duration: 3000
        });

        this.router.navigate(["/home"]);
      }

      this.projectStore.dispatch(getProjectRequest({ id: this.projectId }));

      this.onSiteOpen();
    });
    
    this.project$.pipe(untilDestroyed(this)).subscribe((project) => {
      this.project = project;

      if (this.project?.id) {
        const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

        queryOptions.filters?.push({
          field: 'id',
          operator: 'contains',
          type: 'array',
          value: project.users
        });

        this.userStore.dispatch(getUsersRequest({ queryOptions }));
      }
    });

    this.discussions$.pipe(untilDestroyed(this)).subscribe(({ discussions, total }) => {
      this.discussions = discussions;
    });

    this.users$.pipe(untilDestroyed(this)).subscribe((users) => {
      this.users = users;
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    queryOptions.filters?.push({
      field: 'project',
      operator: 'eq',
      type: 'string',
      value: this.projectId
    });

    this.discussionStore.dispatch(getDiscussionsRequest({ queryOptions }));
  }

  open(type: ('create' | 'edit' | 'delete' | 'details'), id?: string): void {
    if (type === 'create') {
      this.isEdit = false;

      this.isDialogOpen = true;
    } else if (type === 'edit') {
      this.isEdit = true;

      this.discussion = this.discussions.find((discussion: Discussion) => discussion.id === id);
      
      this.formGroup.controls['name'].setValue(this.discussion?.name);
      this.formGroup.controls['description'].setValue(this.discussion?.description);
      
      this.isDialogOpen = true;
    } else if (type === 'delete') {
      this.discussion = this.discussions.find((discussion: Discussion) => discussion.id === id);

      this.isDeleteDialogOpen = true;
    } else if(type === 'details') {
      this.router.navigate([`${id}`], { relativeTo: this.route });
    }
  }

  close(type: ('cancel' | 'submit' | 'delete')): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);
    
    if (type === 'submit') {
      if (!this.isEdit) {
        const newDiscussion: DiscussionInput = {
          description: this.formGroup.controls['description'].value,
          name: this.formGroup.controls['name'].value,
          project: this.projectId!,
          comments: [],
        };

        this.discussionStore.dispatch(createDiscussionRequest({ discussion: newDiscussion }));
      } else {
        const editedDiscussion: DiscussionInput = {
          description: this.formGroup.controls['description'].value,
          name: this.formGroup.controls['name'].value,
          project: this.projectId!,
          comments: [],
        };
  
        this.discussionStore.dispatch(editDiscussionRequest({ id: this.discussion?.id!, discussion: editedDiscussion }));
      }
    } else if (type === 'delete') {
      this.discussionStore.dispatch(deleteDiscussionRequest({ id: this.discussion?.id! }));
    }

    this.formGroup.reset();
    this.discussion = undefined;
    this.isDialogOpen = false;
    this.isDeleteDialogOpen = false;
  }

  isDiscussionsEmpty(): boolean {
    return this.discussions.length === 0;
  }

  getCreatorName(discussion: Discussion): string {
    const user: User = this.users.find((user) => user.id === discussion.creator)!;
    return user.userName;
  }

  getTitle(): string {
    return this.isEdit ? 'Edit Discussion' : 'Create Discussion';
  }

  getQueryOptions(): QueryOptions {
    return getQueryOptions(this.gridState as DataStateChangeEvent);
  }
}
