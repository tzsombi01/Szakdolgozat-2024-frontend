import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { QueryOptions } from 'src/models/query-options';
import { getDiscussionsRequest } from 'src/store/actions/discussion.actions';
import { getDocumentationsRequest } from 'src/store/actions/documentation.actions';
import { getProjectsRequest } from 'src/store/actions/project.actions';
import { getTicketsRequest } from 'src/store/actions/ticket.actions';
import { DiscussionState, DocumentationState, ProjectState, TicketState } from 'src/store/app.states';

@UntilDestroy()
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent  {
  
  @Input()
  searchType: SearchType | string = SearchType.Ticket;

  @Input()
  queryOptions?: QueryOptions;

  searchText: string = '';

  constructor(
    private ticketStore: Store<TicketState>,
    private projectStore: Store<ProjectState>,
    private discussionStore: Store<DiscussionState>,
    private documentationStore: Store<DocumentationState>
  ) {
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
}

export enum SearchType {
  Ticket = 'Ticket',
  Documentation = 'Documentation',
  Discussion = 'Discussion',
  Project = 'Projecte',  
}
