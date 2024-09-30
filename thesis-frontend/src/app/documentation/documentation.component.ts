import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Documentation, DocumentationInput } from 'src/models/documentation';
import { DocumentationState, ProjectState, UserState } from 'src/store/app.states';
import { State } from '@progress/kendo-data-query';
import { getDocumentationLoading, getDocumentationsWithTotal } from 'src/store/selectors/documentation.selector';
import { createDocumentationRequest, deleteDocumentationRequest, editDocumentationRequest, getDocumentationsRequest } from 'src/store/actions/documentation.actions';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/models/user';
import { getUserLoading, getUsers } from 'src/store/selectors/user.selector';
import { Project } from 'src/models/project';
import { getUsersRequest } from 'src/store/actions/user.actions';
import { getProject } from 'src/store/selectors/project.selector';

@UntilDestroy()
@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {

  projectId?: string;

  isDialogOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;
  isEdit: boolean = false;

  documentationsLoading$: Observable<boolean | any>;

  documentations$: Observable<Documentation[] | any>;
  documentations: Documentation[] = [];
  documentation?: Documentation;
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
    private documentationStore: Store<DocumentationState>,
    private projectStore: Store<ProjectState>,
    private userStore: Store<UserState>,
  ) {
    this.documentations$ = this.documentationStore.select(getDocumentationsWithTotal);
    this.project$ = this.projectStore.select(getProject);
    this.users$ = this.userStore.select(getUsers);
    
    this.documentationsLoading$ = this.documentationStore.select(getDocumentationLoading);
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

    this.documentations$.pipe(untilDestroyed(this)).subscribe(({ documentations, total }) => {
      this.documentations = documentations;
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

    this.documentationStore.dispatch(getDocumentationsRequest({ queryOptions }));
  }

  open(type: ('create' | 'edit' | 'delete' | 'details'), id?: string): void {
    if (type === 'create') {
      this.isEdit = false;

      this.isDialogOpen = true;
    } else if (type === 'edit') {
      this.isEdit = true;

      this.documentation = this.documentations.find((documentation: Documentation) => documentation.id === id);
      
      this.formGroup.controls['name'].setValue(this.documentation?.name);
      this.formGroup.controls['description'].setValue(this.documentation?.description);
      
      this.isDialogOpen = true;
    } else if (type === 'delete') {
      this.documentation = this.documentations.find((documentation: Documentation) => documentation.id === id);

      this.isDeleteDialogOpen = true;
    } else if(type === 'details') {
      this.router.navigate([`${id}`], { relativeTo: this.route });
    }
  }

  close(type: ('cancel' | 'submit' | 'delete')): void {
    if (type === 'submit') {
      if (!this.isEdit) {
        const newDocumentation: DocumentationInput = {
          description: this.formGroup.controls['description'].value,
          name: this.formGroup.controls['name'].value,
          project: this.projectId!,
          comments: [],
        };

        this.documentationStore.dispatch(createDocumentationRequest({ documentation: newDocumentation }));
      } else {
        const editedDocumentation: DocumentationInput = {
          description: this.formGroup.controls['description'].value,
          name: this.formGroup.controls['name'].value,
          project: this.projectId!,
          comments: [],
        };
  
        this.documentationStore.dispatch(editDocumentationRequest({ id: this.documentation?.id!, documentation: editedDocumentation }));
      }
    } else if (type === 'delete') {
      this.documentationStore.dispatch(deleteDocumentationRequest({ id: this.documentation?.id! }));
    }

    this.formGroup.reset();
    this.documentation = undefined;
    this.isDialogOpen = false;
    this.isDeleteDialogOpen = false;
  }

  isDocumentationsEmpty(): boolean {
    return this.documentations.length === 0;
  }

  getCreatorName(documentation: Documentation): string {
    const user: User = this.users.find((user) => user.id === documentation.creator)!;
    return user.userName;
  }

  getTitle(): string {
    return this.isEdit ? 'Edit Documentation' : 'Create Documentation';
  }
}
