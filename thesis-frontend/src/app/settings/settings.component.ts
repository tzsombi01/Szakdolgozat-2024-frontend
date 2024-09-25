import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { Status, StatusInput, StatusType } from 'src/models/status';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import { Project } from 'src/models/project';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectState, StatusState } from 'src/store/app.states';
import { Store } from '@ngrx/store';
import { getStatusesWithTotal, getStatusLoading } from 'src/store/selectors/status.selector';
import { getProject } from 'src/store/selectors/project.selector';
import { createStatusRequest, deleteStatusRequest, editStatusRequest, getStatusesRequest } from 'src/store/actions/status.actions';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  projectId?: string;

  isEdit: boolean = false;
  dialogOpened: boolean = false;
  deleteDialogOpened: boolean = false;

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [COMMA, ENTER] as const;
  userEmails: string[] = [];

  statuses$: Observable<Status[] | any>;
  statuses: Status[] = [];
  status?: Status;
  statusesLoading$: Observable<boolean | any>;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(),
    type: new UntypedFormControl(),
  });

  project$: Observable<Project | any>;
  project: Project | undefined;

  types: StatusType[] | string[] = Object.values(StatusType);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private projectStore: Store<ProjectState>,
    private statusStore: Store<StatusState>,
  ) { 
    this.project$ = this.projectStore.select(getProject);
    this.statuses$ = this.statusStore.select(getStatusesWithTotal);

    this.statusesLoading$ = this.statusStore.select(getStatusLoading);
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
          field: 'project',
          operator: 'eq',
          type: 'string',
          value: this.project?.id
        });

        this.statusStore.dispatch(getStatusesRequest({ queryOptions }));
      }
    });

    this.statuses$.pipe(untilDestroyed(this)).subscribe(({ statuses, total }) => {
      this.statuses = statuses;
      console.log(statuses)
    });
  }

  open(type: ('create' | 'edit' | 'delete'), id?: string): void {
    if (type === 'create') {
      this.dialogOpened = true;
    } else if (type === 'edit') {
      this.isEdit = true;

      this.status = this.statuses.find((status: Status) => status.id === id);
      
      this.formGroup.controls['name'].setValue(this.status?.name);
      this.formGroup.controls['type'].setValue(this.status?.type);
      
      this.dialogOpened = true;
    } else if (type === 'delete') {
      this.status = this.statuses.find((status: Status) => status.id === id);
      
      this.deleteDialogOpened = true;
    }
  }

  close(type: ('cancel' | 'submit' | 'delete')): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

    if(type === 'submit') {
      if (this.formGroup.invalid) {
        this.formGroup.markAllAsTouched();
        this.snackBar.open('Please fill out all fields before proceeding!', 'Close', {
          duration: 3000
        });
        return;
      }
    
      if (!this.isEdit) {
        const newStatus: StatusInput = {
          name: this.formGroup.controls['name'].value,
          type: this.formGroup.controls['type'].value,
          project: this.projectId!
        };
  
        this.statusStore.dispatch(createStatusRequest({ status: newStatus, queryOptions }));
      } else {
        const editedStatus: StatusInput = {
          name: this.formGroup.controls['name'].value,
          type: this.formGroup.controls['type'].value,
          project: this.projectId!
        };
  
        this.statusStore.dispatch(editStatusRequest({ id: this.status?.id!, status: editedStatus, queryOptions }));
      }
    } else if (type === 'delete') {
      this.statusStore.dispatch(deleteStatusRequest({ id: this.status?.id!, queryOptions }));
    }

    
    this.formGroup.reset();
    this.status = undefined;
    this.isEdit = false;
    this.deleteDialogOpened = false;
    this.dialogOpened = false;
  }

  getReadableType(type: string): string {
    return type.split('_').map(part => part.toLowerCase()).join(' ');
  }
}
