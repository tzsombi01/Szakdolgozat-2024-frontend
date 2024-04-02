import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ticket } from 'src/models/ticket';
import { TicketState } from 'src/store/app.states';
import { State } from '@progress/kendo-data-query';
import { getTicketsWithTotal } from 'src/store/selectors/ticket.selector';
import { getTicketsRequest } from 'src/store/actions/ticket.actions';
import { QueryOptions } from 'src/models/query-options';

@UntilDestroy()
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  // public tickets: any[] = [
  //   { ticketNumber: 1, assignee: 'John Doe', creator: 'Jane Smith' },
  //   { ticketNumber: 2, assignee: 'Alice Johnson', creator: 'Bob Brown' },
  //   { ticketNumber: 3, assignee: 'Charlie Parker', creator: 'David Wilson' }
  // ];

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

  constructor(
    private ticketStore: Store<TicketState>
  ) {
    this.tickets$ = this.ticketStore.select(getTicketsWithTotal);
  }

  ngOnInit(): void {
    this.tickets$.pipe(untilDestroyed(this)).subscribe(({ tickets, total }) => {
      this.tickets = tickets;
      console.log(tickets)
      console.log(total)
    });
  }

  onSiteOpen(): void {
    const queryOptions: QueryOptions = getQueryOptions(state, this.selectedSite!, this.route);

    this.ticketStore.dispatch(getTicketsRequest({ queryOptions }))
  }

  isTicketsEmpty(): boolean {
    return this.tickets.length === 0;
  }
}
