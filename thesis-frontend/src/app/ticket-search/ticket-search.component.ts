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
import { Status, StatusType } from 'src/models/status';
import { Ticket, TicketInput } from 'src/models/ticket';
import { getQueryOptions } from 'src/shared/common-functions';
import { getProjectRequest } from 'src/store/actions/project.actions';
import { getTicketsRequest, createTicketRequest, editTicketRequest, deleteTicketRequest } from 'src/store/actions/ticket.actions';
import { ProjectState, StatusState, TicketState, UserState } from 'src/store/app.states';
import { getTicketsWithTotal, getTicketLoading } from 'src/store/selectors/ticket.selector';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { getStatusesWithTotal, getStatusLoading } from 'src/store/selectors/status.selector';
import { Project } from 'src/models/project';
import { getStatusesRequest } from 'src/store/actions/status.actions';
import { getProject } from 'src/store/selectors/project.selector';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { User } from 'src/models/user';
import { getUsers } from 'src/store/selectors/user.selector';
import { getUsersRequest } from 'src/store/actions/user.actions';

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
  selectedTicketReferences: string[] = [];

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(),
    description: new UntypedFormControl(),
    selectedAssignee: new UntypedFormControl(),
    creator: new UntypedFormControl(),
  });

  users$: Observable<User[] | any>;
  users: User[] = [];

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar,
    private ticketStore: Store<TicketState>,
    private projectStore: Store<ProjectState>,
    private statusStore: Store<StatusState>,
    private userStore: Store<UserState>,
    private cdr: ChangeDetectorRef
  ) {
    this.project$ = this.projectStore.select(getProject);
    this.tickets$ = this.ticketStore.select(getTicketsWithTotal);
    this.statuses$ = this.statusStore.select(getStatusesWithTotal);
    this.users$ = this.userStore.select(getUsers);

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

        const usersQueryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent);

        usersQueryOptions.filters?.push({
          field: 'id',
          operator: 'contains',
          type: 'array',
          value: project.users
        });

        this.userStore.dispatch(getUsersRequest({ queryOptions: usersQueryOptions }));
      }
    });

    this.statuses$.pipe(untilDestroyed(this)).subscribe(({ statuses, total }) => {
      this.statuses = statuses;

      if (total > 0) {
        this.filteredStatuses = this.statusControls.valueChanges.pipe(
          startWith(null),
          map((status: Status | null) => status ? this._filter(status) : this.statuses.slice()));
      }

      this.cdr.detectChanges();
    });

    this.users$.pipe(untilDestroyed(this)).subscribe((users) => {
      this.users = users;
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
      this.formGroup.controls['selectedAssignee'].setValue(this.ticket?.assignee);

      this.selectedStatuses = this.statuses.filter((status: Status) => this.ticket?.statuses.includes(status.id!));

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
          assignee: this.formGroup.controls['selectedAssignee'].value ?? '',
          mentionedInCommits: [],
          statuses: this.getStatuses(),
          ticketReferences: this.selectedTicketReferences,
          comments: this.ticket?.comments!,
          closed: false
        };

        this.ticketStore.dispatch(createTicketRequest({ ticket: newTicket, queryOptions: ({} as Object) as QueryOptions }));
      } else {
        const editedTicket: TicketInput = {
          description: this.formGroup.controls['description'].value,
          name: this.formGroup.controls['name'].value,
          project: this.projectId!,
          assignee: this.formGroup.controls['selectedAssignee'].value ?? '',
          mentionedInCommits: [],
          statuses: this.getStatuses(),
          ticketReferences: this.selectedTicketReferences,
          comments: this.ticket?.comments!,
          closed: this.ticket?.closed ?? false
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
    if (!this.auto?.isOpen) {
      const input = event.input;
      const value = event.value;

      if (value) {
        this.selectedStatuses.push(value);
      }

      if (input) {
        input.value = '';
      }

      this.statusControls.setValue(null);
    }
  }

  remove(status: Status | any): void {
    const index = this.selectedStatuses.indexOf(status);
      
    if (index >= 0) {
      this.selectedStatuses.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedStatuses.push(event.option.value);
    this.statusInput!.nativeElement.value = '';
    this.statusControls.setValue(null);
  }

  private _filter(value: any): any[] {
    if (!value?.name) {
      const filterValue = value.toLowerCase();

      return this.statuses.filter(status => status.name.toLowerCase().indexOf(filterValue) === 0);
    }

    const filterValue = value.name.toLowerCase();

    return this.statuses.filter(status => status.name.toLowerCase().indexOf(filterValue) === 0);
  }

  getName(id?: string, type?: ('assignee' | 'creator')): string {
    const user: User | undefined = this.users.find(user => user.id === id); 
    return user ? user.firstName + ' ' + user.lastName : (type ? 'No assignee' : 'No creator');
  }

  getBackgroundColor(status: Status): string {
    switch (status.type) {
      case StatusType.CRITICAL:
        return 'red';
      case StatusType.WORKING_ON_IT:
        return '#26ff59';
      case StatusType.TBD:
        return '#08adff';
      case StatusType.DONE:
        return 'lightblue';
      case StatusType.NORMAL:
        return 'white';
      default:
        return 'white';
    }
  }

  getQueryOptions(): QueryOptions {
    return getQueryOptions(this.gridState as DataStateChangeEvent);
  }
}
