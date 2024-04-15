import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ticket, TicketInput } from 'src/models/ticket';
import { TicketState } from 'src/store/app.states';
import { State } from '@progress/kendo-data-query';
import { getTicketsWithTotal } from 'src/store/selectors/ticket.selector';
import { createTicketRequest, getTicketsRequest } from 'src/store/actions/ticket.actions';
import { QueryOptions } from 'src/models/query-options';
import { getQueryOptions } from 'src/shared/common-functions';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  isDialogOpen: boolean = false;
  isEdit: boolean = false;

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

  formData: UntypedFormGroup = new UntypedFormGroup({
    assignee: new UntypedFormControl(),
    creator: new UntypedFormControl(),
    description: new UntypedFormControl(),
  });

  constructor(
    public route: ActivatedRoute,
    private http: HttpClient,
    private ticketStore: Store<TicketState>
  ) {
    this.tickets$ = this.ticketStore.select(getTicketsWithTotal);
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

  open(type: ('create' | 'edit'), id?: string): void {
    if (type === 'create') {
      this.isEdit = false;
    } else if (type === 'edit') {
      this.isEdit = true;

      // Filter selected item!
    }

    this.isDialogOpen = true;
  }

  close(type: ('cancel' | 'submit')): void {
    if (type === 'submit') {
      if (!this.isEdit) {
        const newTicket: TicketInput = {
          comments: [],
          assignee: '5' ?? '',
          creator: '21',
          mentionedInCommits: [],
          statuses: ['Done'],
          ticketReferences: ['2'],
          description: 'Wuhuhu description'
        };

        this.ticketStore.dispatch(createTicketRequest({ ticket: newTicket, queryOptions: ({} as Object) as QueryOptions }));
      }
    } else {

    }

    this.isDialogOpen = false;
  }

  isTicketsEmpty(): boolean {
    return this.tickets.length === 0;
  }
}
