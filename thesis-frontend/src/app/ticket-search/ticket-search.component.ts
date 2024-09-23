import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { map, Observable, startWith } from 'rxjs';
import { CommentInput } from 'src/models/comment';
import { QueryOptions } from 'src/models/query-options';
import { Status } from 'src/models/status';
import { Ticket, TicketInput } from 'src/models/ticket';
import { getQueryOptions } from 'src/shared/common-functions';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { getTicketsRequest, createTicketRequest, editTicketRequest, deleteTicketRequest } from 'src/store/actions/ticket.actions';
import { ProjectState, StatusState, TicketState } from 'src/store/app.states';
import { getTicketsWithTotal, getTicketLoading } from 'src/store/selectors/ticket.selector';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { getStatusesWithTotal, getStatusLoading } from 'src/store/selectors/status.selector';
import { Project } from 'src/models/project';
import { getStatusesRequest } from 'src/store/actions/status.actions';
import { getProject } from 'src/store/selectors/project.selector';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@UntilDestroy()
@Component({
  selector: 'app-ticket-search',
  templateUrl: './ticket-search.component.html',
  styleUrls: ['./ticket-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketSearchComponent implements OnInit {

  @ViewChild('auto', {static: false}) auto?: MatAutocomplete;
  @ViewChild('statusInput', {static: false}) statusInput?: ElementRef<HTMLInputElement>;

  projectId?: string;

  isDialogOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;
  isEdit: boolean = false;

  currentStatus?: Status;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  statusControls = new FormControl();
  filteredStatuses?: Observable<any[]>;

  ticketsLoading$: Observable<boolean | any>;

  tickets$: Observable<Ticket[] | any>;
  tickets: Ticket[] = [];
  ticket?: Ticket;
  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  statuses$: Observable<Status[] | any>;
  statuses: Status[] = [];
  statusesLoading$: Observable<boolean | any>;
  statusGridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };
  selectedStatuses: any[] = [];
  
  project$: Observable<Project | any>;
  project: Project | undefined;

  addedComments: CommentInput[] = [];
  selectedAssignee: string | undefined;
  selectedTicketReferences: string[] = [];

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(),
    description: new UntypedFormControl(),
  });

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
    private ticketStore: Store<TicketState>,
    private projectStore: Store<ProjectState>,
    private statusStore: Store<StatusState>,
    private cdr: ChangeDetectorRef
  ) {
    this.project$ = this.projectStore.select(getProject);
    this.tickets$ = this.ticketStore.select(getTicketsWithTotal);
    this.statuses$ = this.statusStore.select(getStatusesWithTotal);

    this.statusesLoading$ = this.statusStore.select(getStatusLoading);
    this.ticketsLoading$ = this.ticketStore.select(getTicketLoading);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id') ?? '';

      if (!this.projectId) {
        this.snackBar.open('No project ID provided', 'Close', {
          duration: 3000
        });

        this.router.navigate(["/home"]);
      }

      this.projectStore.dispatch(getProjectRequest({ id: this.projectId }));
    });
    
    this.onSiteOpen();


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
      if (total > 0) {
        this.filteredStatuses = this.statusControls.valueChanges.pipe(
          startWith(null),
          map((status: Status | null) => status ? this._filter(status) : this.statuses.slice()));
      }

      this.cdr.detectChanges();
    });

    this.tickets$.pipe(untilDestroyed(this)).subscribe(({ tickets, total }) => {
      this.tickets = tickets;

      this.cdr.detectChanges();
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

    this.ticketStore.dispatch(getTicketsRequest({ queryOptions }));
  }

  open(type: ('create' | 'edit' | 'delete' | 'details'), id?: string): void {
    if (type === 'create') {
      this.isEdit = false;

      this.isDialogOpen = true;
    } else if (type === 'edit') {
      this.isEdit = true;

      this.ticket = this.tickets.find((ticket: Ticket) => ticket.id === id);
      
      this.formGroup.controls['name'].setValue(this.ticket?.name);
      this.formGroup.controls['description'].setValue(this.ticket?.description);
      
      this.isDialogOpen = true;
    } else if (type === 'delete') {
      this.ticket = this.tickets.find((ticket: Ticket) => ticket.id === id);
      
      this.isDeleteDialogOpen = true;
    } else if(type === 'details') {
      this.router.navigate([`tickets/${id}`], { relativeTo: this.route });
    }
  }

  close(type: ('cancel' | 'submit' | 'delete')): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);
    
    if (type === 'submit') {
      if (!this.isEdit) {
        const newTicket: TicketInput = {
          description: this.formGroup.controls['description'].value,
          name: this.formGroup.controls['name'].value,
          project: this.projectId!,
          assignee: this.selectedAssignee ?? '',
          mentionedInCommits: [],
          statuses: this.getStatuses(),
          ticketReferences: this.selectedTicketReferences,
          comments: [],
        };

        this.ticketStore.dispatch(createTicketRequest({ ticket: newTicket, queryOptions: ({} as Object) as QueryOptions }));
      } else {
        const editedTicket: TicketInput = {
          description: this.formGroup.controls['description'].value,
          name: this.formGroup.controls['name'].value,
          project: this.projectId!,
          assignee: this.selectedAssignee ?? '',
          mentionedInCommits: [],
          statuses: this.getStatuses(),
          ticketReferences: this.selectedTicketReferences,
          comments: [],
        };
  
        this.ticketStore.dispatch(editTicketRequest({ id: this.ticket?.id!, ticket: editedTicket, queryOptions: ({} as Object) as QueryOptions }));
      }
    } else if (type === 'delete') {
      this.ticketStore.dispatch(deleteTicketRequest({ id: this.ticket?.id!, queryOptions }));
    }

    this.formGroup.reset();
    this.ticket = undefined;
    this.isDialogOpen = false;
    this.isDeleteDialogOpen = false;
  }

  getStatuses(): any[] {
    return this.selectedStatuses.map(status => status.id);
  }

  isTicketsEmpty(): boolean {
    return this.tickets.length === 0;
  }

  getTitle(): string {
    return this.isEdit ? 'Edit Ticket' : 'Create Ticket';
  }

  add(event: MatChipInputEvent): void {
    console.log(event)
    if (!this.auto?.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.selectedStatuses.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.statusControls.setValue(null);
    }
  }

  remove(status: Status | any): void {
    console.log(status)
      const index = this.selectedStatuses.indexOf(status);
      
      if (index >= 0) {
        this.selectedStatuses.splice(index, 1);
      }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event)
    this.selectedStatuses.push(event.option.viewValue);
    this.statusInput!.nativeElement.value = '';
    this.statusControls.setValue(null);
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();

    return this.statuses.filter(status => status.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
