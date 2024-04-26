import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Ticket } from 'src/models/ticket';
import { getTicketRequest } from 'src/store/actions/ticket.actions';
import { TicketState } from 'src/store/app.states';
import { getTicket } from 'src/store/selectors/ticket.selector';

@UntilDestroy()
@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  
  ticket$: Observable<Ticket | any>;
  ticket: Ticket | undefined;

  ticketId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private ticketStore: Store<TicketState>,
  ) { 
    this.ticket$ = this.ticketStore.select(getTicket);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ticketId = params.get('id') ?? '';

      if (!this.ticketId) {
        this.snackBar.open('No ticket ID provided', 'Close', {
          duration: 3000
        });

        this.router.navigate(["/home"]);
      }

      this.ticketStore.dispatch(getTicketRequest({ id: this.ticketId }));
    });

    this.ticket$.pipe(untilDestroyed(this)).subscribe((ticket) => {
      console.log(ticket);
      this.ticket = ticket;
    });
  }
}
