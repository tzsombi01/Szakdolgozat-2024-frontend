import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { DiscussionInput } from 'src/models/discussion'; 

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  constructor(private apollo: Apollo) { }

  public getDiscussions(queryOptions: QueryOptions): Observable<any> { 
    return this.apollo.query<any>({
      query: gql`
        ${this.CORE_DISCUSSION_FIELDS} 
        query GetDiscussions($queryOptions: QueryOptions!) {
          getDiscussions(queryOptions: $queryOptions) {
            content {
              ... on Discussion {
                ...CoreDiscussionFields
              }
            }
            total
          }
        }
      `,
      variables: { queryOptions }
    });
  }

  public createDiscussion(discussion: DiscussionInput): Observable<any> { 
    return this.apollo.mutate<any>({
      mutation: gql`
        ${this.CORE_DISCUSSION_FIELDS} 
        mutation CreateDiscussion($discussion: DiscussionInput!) { 
          createDiscussion(discussion: $discussion) {
            ...CoreDiscussionFields 
          }
        }
      `,
      variables: { discussion }
    });
  }

  public editDiscussion(id: string, discussion: DiscussionInput): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        ${this.CORE_DISCUSSION_FIELDS}
        mutation EditDiscussion($id: ID!, $discussion: DiscussionInput!) { 
          editDiscussion(id: $id, discussion: $discussion) {
            ...CoreDiscussionFields 
          }
        }
      `,
      variables: { id, discussion }
    });
  }

  public deleteDiscussion(id: string): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation DeleteDiscussion($id: ID!) {
          deleteDiscussion(id: $id) {
            id
          }
        }
      `,
      variables: { id }
    });
  }

  CORE_DISCUSSION_FIELDS: any = gql`
    fragment CoreDiscussionFields on Discussion {
      id
      createdAt
      modifiedAt
      createdBy
      modifiedBy
      deleted
      name
      creator
      description
      comments
    }
  `;
}
