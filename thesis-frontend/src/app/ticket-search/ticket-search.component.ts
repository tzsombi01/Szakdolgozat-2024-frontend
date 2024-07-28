import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { CommentInput } from 'src/models/comment';
import { QueryOptions } from 'src/models/query-options';
import { Ticket, TicketInput } from 'src/models/ticket';
import { getQueryOptions } from 'src/shared/common-functions';
import { getTicketsRequest, createTicketRequest, editTicketRequest, deleteTicketRequest } from 'src/store/actions/ticket.actions';
import { TicketState } from 'src/store/app.states';
import { getTicketsWithTotal, getTicketLoading } from 'src/store/selectors/ticket.selector';

@UntilDestroy()
@Component({
  selector: 'app-ticket-search',
  templateUrl: './ticket-search.component.html',
  styleUrls: ['./ticket-search.component.css']
})
export class TicketSearchComponent implements OnInit {
  
  isDialogOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;
  isEdit: boolean = false;

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

  selectedStatuses: string[] = [];
  addedComments: CommentInput[] = [];
  selectedAssignee: string | undefined;
  selectedTicketReferences: string[] = [];

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    description: new UntypedFormControl(),
  });

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private ticketStore: Store<TicketState>
  ) {
    this.tickets$ = this.ticketStore.select(getTicketsWithTotal);
    
    this.ticketsLoading$ = this.ticketStore.select(getTicketLoading);
  }

  ngOnInit(): void {
    this.onSiteOpen();

    this.tickets$.pipe(untilDestroyed(this)).subscribe(({ tickets, total }) => {
      this.tickets = tickets;
      console.log(tickets)
      console.log(total)
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent, this.route);

    this.ticketStore.dispatch(getTicketsRequest({ queryOptions }));
  }

  open(type: ('create' | 'edit' | 'delete' | 'details'), id?: string): void {
    if (type === 'create') {
      this.isEdit = false;

      this.isDialogOpen = true;
    } else if (type === 'edit') {
      this.isEdit = true;

      this.ticket = this.tickets.find((ticket: Ticket) => ticket.id === id);
      
      this.formGroup.controls['description'].setValue(this.ticket?.description);
      
      this.isDialogOpen = true;
    } else if (type === 'delete') {
      this.ticket = this.tickets.find((ticket: Ticket) => ticket.id === id);
      
      this.isDeleteDialogOpen = true;
    } else if(type === 'details') {
      this.router.navigate([`/tickets/${id}`]);
    }
  }

  close(type: ('cancel' | 'submit' | 'delete')): void {
    const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent, this.route);
    
    if (type === 'submit') {
      if (!this.isEdit) {
        const newTicket: TicketInput = {
          description: this.formGroup.controls['description'].value,
          assignee: this.selectedAssignee,
          creator: '1', // this.user.id,
          mentionedInCommits: [],
          statuses: this.selectedStatuses,
          ticketReferences: this.selectedTicketReferences,
          comments: [],
        };

        this.ticketStore.dispatch(createTicketRequest({ ticket: newTicket, queryOptions: ({} as Object) as QueryOptions }));
      } else {
        const editedTicket: TicketInput = {
          description: this.formGroup.controls['description'].value,
          assignee: this.selectedAssignee,
          creator: '1', // this.user.id,
          mentionedInCommits: [],
          statuses: this.selectedStatuses,
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

  isTicketsEmpty(): boolean {
    return this.tickets.length === 0;
  }
}
