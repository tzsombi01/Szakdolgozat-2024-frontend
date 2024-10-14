import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import { Observable } from 'rxjs';
import { Project } from 'src/models/project';
import { QueryOptions } from 'src/models/query-options';
import { User } from 'src/models/user';
import { getQueryOptions } from 'src/shared/common-functions';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { getUsersRequest, sendInviteToEmailsRequest } from 'src/store/actions/user.actions';
import { ProjectState, UserState } from 'src/store/app.states';
import { getProject } from 'src/store/selectors/project.selector';
import { getUserLoading, getUsers } from 'src/store/selectors/user.selector';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';

@UntilDestroy()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  usersDialogOpened: boolean = false;

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [COMMA, ENTER] as const;
  userEmails: string[] = [];

  users$: Observable<User[] | any>;
  users: User[] = [];
  usersLoading$: Observable<boolean | any>;
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

  projectId: string | undefined;

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    users: new UntypedFormControl(),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private projectStore: Store<ProjectState>,
    private userStore: Store<UserState>,
  ) { 
    this.project$ = this.projectStore.select(getProject);
    this.users$ = this.userStore.select(getUsers);

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

    this.users$.pipe(untilDestroyed(this)).subscribe((users) => {
      this.users = users;
    });
  }

  open(type: ('add')): void {
    if (type === 'add') {
      this.usersDialogOpened = true;
    }
  }

  close(type: ('cancel' | 'submit')): void {
    if(type === 'submit') {
      if (this.userEmails.length === 0) {
        this.snackBar.open('Please provide at least one email address!', 'Close', {
          duration: 3000
        });
        return;
      }

      if (!this.userEmails.every(email => this.isValidAddress(email))) {
        this.snackBar.open('Please make sure that all email addresses are valid!', 'Close', {
          duration: 3000
        });
        return;
      }

      this.userStore.dispatch(sendInviteToEmailsRequest({ projectId: this.projectId!, emails: this.userEmails }));
    }

    this.usersDialogOpened = false;
    this.formGroup.reset();
  }

  isValidAddress(email: string): boolean {
    const emailControl = new FormControl(email, Validators.email);
    return emailControl.valid;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.userEmails = [...this.userEmails, value];
    }

    event.chipInput!.clear();
  }

  remove(userEmailToRemove: string): void {
    const index = this.userEmails.indexOf(userEmailToRemove);

    this.userEmails.splice(index, 1);
  }

  edit(userEmail: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(userEmail);
      return;
    }

    const index = this.userEmails.indexOf(userEmail);
      
    if (index >= 0) {
      this.userEmails[index] = value;
    }
  }
}
