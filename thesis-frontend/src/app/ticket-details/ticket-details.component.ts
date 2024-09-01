import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid/data/change-event-args.interface';
import { State } from '@progress/kendo-data-query/dist/npm/state';
import { marked } from 'marked';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { Ticket, TicketInput } from 'src/models/ticket';
import { User } from 'src/models/user';
import { getQueryOptions } from 'src/shared/common-functions';
import { editTicketRequest, getTicketRequest } from 'src/store/actions/ticket.actions';
import { getUsersRequest } from 'src/store/actions/user.actions';
import { TicketState, UserState } from 'src/store/app.states';
import { getTicket } from 'src/store/selectors/ticket.selector';
import { getUserLoading, getUsers } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  
  isEditingDescription = false;
  markdownDescription: string = '';
  parsedDescription: string = '';

  users$: Observable<User[] | any>;
  users: User[] = [];
  usersLoading$: Observable<boolean | any>;

  ticket$: Observable<Ticket | any>;
  ticket: Ticket | undefined;

  ticketId: string | undefined;

  gridState: State = {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private ticketStore: Store<TicketState>,
    private userStore: Store<UserState>,
  ) { 
    this.ticket$ = this.ticketStore.select(getTicket);
    this.users$ = this.userStore.select(getUsers);
    
    this.usersLoading$ = this.userStore.select(getUserLoading);  
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
      this.ticket = ticket;

      if (this.ticket?.id) {
        // Get Statuses

        const usersNeeded: string[] = [this.ticket.creator];

        this.markdownDescription = this.ticket?.description || '';
        this.parseMarkdown(this.markdownDescription);

        if (this.ticket?.assignee) {
          usersNeeded.push(this.ticket.assignee);
        }

        const queryOptions: QueryOptions = getQueryOptions(this.gridState as DataStateChangeEvent, this.route);

        queryOptions.filters?.push({
          field: 'id',
          operator: 'contains',
          type: 'array',
          value: usersNeeded
        });

        this.userStore.dispatch(getUsersRequest({ queryOptions }));
      }
    });

    this.users$.pipe(untilDestroyed(this)).subscribe((users) => {
      this.users = users;
    });
  }

  close(type: ('description')) {
    if (type === 'description') {
        const editedTicket: TicketInput = {
          ...this.ticket,
          description: this.markdownDescription,
        } as TicketInput;
  
        this.ticketStore.dispatch(editTicketRequest({ id: this.ticket?.id!, ticket: editedTicket, queryOptions: ({} as Object) as QueryOptions }));
        // window.location.reload();
    }
  }

  getUser(id?: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  toggleEditDescription() {
    if (this.isEditingDescription) {
      this.ticket!.description = this.markdownDescription;
      this.parseMarkdown(this.markdownDescription);
    }
    this.isEditingDescription = !this.isEditingDescription;
  }

  parseMarkdown(markdown: string): void {
    const result = marked.parse(markdown || '');

    if (typeof result === 'string') {
        this.parsedDescription = result;
    } else if (result instanceof Promise) {
        result.then(res => {
            this.parsedDescription = res;
        });
    }
  }
}
