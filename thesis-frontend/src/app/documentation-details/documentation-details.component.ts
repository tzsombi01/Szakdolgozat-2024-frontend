import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import { Observable } from 'rxjs';
import { Documentation } from 'src/models/documentation';
import { Project } from 'src/models/project';
import { QueryOptions } from 'src/models/query-options';
import { User } from 'src/models/user';
import { getQueryOptions } from 'src/shared/common-functions';
import { getDocumentationRequest } from 'src/store/actions/documentation.actions';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { getUsersRequest } from 'src/store/actions/user.actions';
import { DocumentationState, ProjectState, UserState } from 'src/store/app.states';
import { getDocumentation, getDocumentationLoading } from 'src/store/selectors/documentation.selector';
import { getProject } from 'src/store/selectors/project.selector';
import { getLoggedInUser, getUserLoading, getUsers } from 'src/store/selectors/user.selector';
import { marked } from 'marked';

@UntilDestroy()
@Component({
  selector: 'app-documentation-details',
  templateUrl: './documentation-details.component.html',
  styleUrls: ['./documentation-details.component.css']
})
export class DocumentationDetailsComponent implements OnInit {

  documentationId: string | undefined;
  
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

  documentation$: Observable<Documentation | any>;
  documentation: Documentation | undefined;
  documentationLoading$: Observable<boolean | any>;
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
    private documentationStore: Store<DocumentationState>,
    private userStore: Store<UserState>,
    private projectStore: Store<ProjectState>,
  ) {
    this.documentation$ = this.documentationStore.select(getDocumentation);
    this.users$ = this.userStore.select(getUsers);
    this.loggedInUser$ = this.userStore.select(getLoggedInUser);
    this.project$ = this.projectStore.select(getProject);

    this.usersLoading$ = this.userStore.select(getUserLoading);
    this.documentationLoading$ = this.documentationStore.select(getDocumentationLoading);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.documentationId = params.get('documentationId') ?? '';

      if (!this.documentationId) {
        this.snackBar.open('No documentation ID provided', 'Close', {
          duration: 3000
        });

        this.router.navigate(['/..']);
      }

      this.documentationStore.dispatch(getDocumentationRequest({ id: this.documentationId }));
    });

    this.documentation$.pipe(untilDestroyed(this)).subscribe((documentation) => {
      this.documentation = documentation;

      if (this.documentation?.id) {
        this.selectedCreator = this.documentation.creator;

        this.markdownDescription = this.documentation?.description || '';
        this.parseMarkdown(this.markdownDescription);

        this.projectStore.dispatch(getProjectRequest({ id: this.documentation.project }));
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
