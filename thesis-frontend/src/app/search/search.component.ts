import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { User } from 'src/models/user';
import { getDiscussionsRequest } from 'src/store/actions/discussion.actions';
import { getDocumentationsRequest } from 'src/store/actions/documentation.actions';
import { getProjectsRequest } from 'src/store/actions/project.actions';
import { getTicketsRequest } from 'src/store/actions/ticket.actions';
import { DiscussionState, DocumentationState, ProjectState, TicketState, UserState } from 'src/store/app.states';
import { getLoggedInUser } from 'src/store/selectors/user.selector';

@UntilDestroy()
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  @Input()
  searchType: SearchType | string = SearchType.Ticket;

  @Input()
  queryOptions?: QueryOptions;

  loggedInUser$: Observable<User | any>;
  loggedInUser: User | undefined;

  searchText: string = '';
  ownTickets: boolean = false;

  constructor(
    private ticketStore: Store<TicketState>,
    private projectStore: Store<ProjectState>,
    private discussionStore: Store<DiscussionState>,
    private documentationStore: Store<DocumentationState>,
    private userStore: Store<UserState>,
  ) {
    this.loggedInUser$ = this.userStore.select(getLoggedInUser);
  }

  ngOnInit(): void {
    this.loggedInUser$.pipe(untilDestroyed(this)).subscribe((user) => {  
      this.loggedInUser = user;
    });
  }

  onSearchTextChange() {
    const localQueryOptions: QueryOptions = { ...this.queryOptions };

    switch(this.searchType) {
      case SearchType.Ticket:
        localQueryOptions.filters?.push({
          field: 'name',
          operator: 'contains',
          type: 'string',
          value: this.searchText
        });
        
        if (this.ownTickets) {
          localQueryOptions.filters?.push({
            field: 'assignee',
            operator: 'eq',
            type: 'string',
            value: this.loggedInUser?.id
          });
        }
        
        this.ticketStore.dispatch(getTicketsRequest({ queryOptions: localQueryOptions }));
        break;
      case SearchType.Documentation:
        localQueryOptions.filters?.push({
          field: 'name',
          operator: 'contains',
          type: 'string',
          value: this.searchText
        });

        this.documentationStore.dispatch(getDocumentationsRequest({ queryOptions: localQueryOptions }));
        break;
      case SearchType.Discussion:
        localQueryOptions.filters?.push({
          field: 'name',
          operator: 'contains',
          type: 'string',
          value: this.searchText
        });

        this.discussionStore.dispatch(getDiscussionsRequest({ queryOptions: localQueryOptions }));
        break;
      case SearchType.Project:
        localQueryOptions.filters?.push({
          field: 'name',
          operator: 'contains',
          type: 'string',
          value: this.searchText
        });

        this.projectStore.dispatch(getProjectsRequest({ queryOptions: localQueryOptions }));
        break;
      default:
        console.log(`Unknown search type: ${this.searchText}`);
    }
  }

  ownTicketsToggle(): void {
    this.ownTickets = !this.ownTickets;
   
    this.onSearchTextChange();
  }

  isTicketMode(): boolean {
    return this.searchType === SearchType.Ticket;
  }
}

export enum SearchType {
  Ticket = 'Ticket',
  Documentation = 'Documentation',
  Discussion = 'Discussion',
  Project = 'Projecte',  
}
