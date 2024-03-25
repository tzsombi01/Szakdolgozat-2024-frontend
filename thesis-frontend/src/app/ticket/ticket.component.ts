import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  public tickets: any[] = [
    { ticketNumber: 1, assignee: 'John Doe', creator: 'Jane Smith' },
    { ticketNumber: 2, assignee: 'Alice Johnson', creator: 'Bob Brown' },
    { ticketNumber: 3, assignee: 'Charlie Parker', creator: 'David Wilson' }
  ];

  constructor() {

  }

  ngOnInit(): void {
    
  }

  isTicketsEmpty(): boolean {
    return this.tickets.length === 0;
  }
}
