import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { TicketInput } from 'src/models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private apollo: Apollo) { }

  public getTickets(queryOptions: QueryOptions): Observable<any> {
    return this.apollo.query<any>({
      query: gql`
        ${this.CORE_TICKET_FIELDS}
        query GetTickets($queryOptions: QueryOptions!) {
          getTickets(queryOptions: $queryOptions) {
            content {
              ... on Ticket {
                ...CoreTicketFields
              }
            }
            total
          }
        }
      `,
      variables: { queryOptions }
    });
  }

  public createTicket(ticket: TicketInput): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        ${this.CORE_TICKET_FIELDS}
        mutation CreateTicket($ticket: TicketInput!) {
          createTicket(ticket: $ticket) {
            ...CoreTicketFields
          }
        }
      `,
      variables: { ticket }
    });
  }

  public editTicket(id: string, ticket: TicketInput): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        ${this.CORE_TICKET_FIELDS}
        mutation EditTicket($id: ID!, $ticket: TicketInput!) {
          editTicket(id: $id, ticket: $ticket) {
            ...CoreTicketFields
          }
        }
      `,
      variables: { id, ticket }
    });
  }

  public deleteTicket(id: string): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation DeleteTicket($id: ID!) {
          deleteTicket(id: $id) {
            id
          }
        }
      `,
      variables: { id }
    });
  }

  CORE_TICKET_FIELDS: any = gql`
    fragment CoreTicketFields on Ticket {
      id
      createdAt
      modifiedAt
      createdBy
      modifiedBy
      deleted
      ticketNumber
      assignee
      creator
      description
      ticketReferences
      statuses
      comments
      mentionedInCommits
    }
  `;
}
