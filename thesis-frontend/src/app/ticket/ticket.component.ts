import { Component } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {

  public tickets: any[] = [
    { ticketNumber: 1, assignee: 'John Doe', creator: 'Jane Smith' },
    { ticketNumber: 2, assignee: 'Alice Johnson', creator: 'Bob Brown' },
    { ticketNumber: 3, assignee: 'Charlie Parker', creator: 'David Wilson' }
  ];

  isTicketsEmpty(): boolean {
    return false;
  }
}
