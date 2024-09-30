import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { marked } from 'marked';
import { Observable } from 'rxjs';
import { Discussion } from 'src/models/discussion';
import { Project } from 'src/models/project';
import { QueryOptions } from 'src/models/query-options';
import { User } from 'src/models/user';
import { getQueryOptions } from 'src/shared/common-functions';
import { getDiscussionRequest } from 'src/store/actions/discussion.actions';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { getUsersRequest } from 'src/store/actions/user.actions';
import { DiscussionState, ProjectState, UserState } from 'src/store/app.states';
import { getDiscussion, getDiscussionLoading } from 'src/store/selectors/discussion.selector';
import { getProject } from 'src/store/selectors/project.selector';
import { getLoggedInUser, getUserLoading, getUsers } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-discussion-details',
  templateUrl: './discussion-details.component.html',
  styleUrls: ['./discussion-details.component.css']
})
export class DiscussionDetailsComponent implements OnInit {

  discussionId: string | undefined;
  
  isEditingDescription = false;
  markdownDescription: string = '';
  parsedDescription: string = '';

  users$: Observable<User[] | any>;
  users: User[] = [];
  usersLoading$: Observable<boolean | any>;

  loggedInUser$: Observable<User | any>;
  loggedInUser: User | undefined;

  project$: Observable<Project | any>;
  project: Project | undefined;

  discussion$: Observable<Discussion | any>;
  discussion: Discussion | undefined;
  discussionLoading$: Observable<boolean | any>;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };
  selectedCreator?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private discussionStore: Store<DiscussionState>,
    private userStore: Store<UserState>,
    private projectStore: Store<ProjectState>,
  ) {
    this.discussion$ = this.discussionStore.select(getDiscussion);
    this.users$ = this.userStore.select(getUsers);
    this.loggedInUser$ = this.userStore.select(getLoggedInUser);
    this.project$ = this.projectStore.select(getProject);

    this.usersLoading$ = this.userStore.select(getUserLoading);
    this.discussionLoading$ = this.discussionStore.select(getDiscussionLoading);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.discussionId = params.get('discussionId') ?? '';

      if (!this.discussionId) {
        this.snackBar.open('No discussion ID provided', 'Close', {
          duration: 3000
        });

        this.router.navigate(['/..']);
      }

      this.discussionStore.dispatch(getDiscussionRequest({ id: this.discussionId }));
    });

    this.discussion$.pipe(untilDestroyed(this)).subscribe((discussion) => {
      this.discussion = discussion;

      if (this.discussion?.id) {
        this.selectedCreator = this.discussion.creator;

        this.markdownDescription = this.discussion?.description || '';
        this.parseMarkdown(this.markdownDescription);

        this.projectStore.dispatch(getProjectRequest({ id: this.discussion.project }));
      }
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

    this.loggedInUser$.pipe(untilDestroyed(this)).subscribe((user) => {  
      this.loggedInUser = user;
    });
  }

  parseMarkdown(markdown: string): void {
    const result = marked.parse(markdown || '');

    if (typeof result === 'string') {
      this.parsedDescription = result;
    } else if (result instanceof Promise) {
      result.then(res => {
        this.parsedDescription = res;
      });
    }
  }
}
