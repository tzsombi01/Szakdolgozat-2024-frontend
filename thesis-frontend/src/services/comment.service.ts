import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { CommentInput } from 'src/models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private apollo: Apollo) { }

  public getComments(queryOptions: QueryOptions): Observable<any> {
    return this.apollo.query<any>({
      query: gql`
        ${this.CORE_COMMENT_FIELDS}
        query GetComments($queryOptions: QueryOptions!) {
          getComments(queryOptions: $queryOptions) {
            content {
              ... on Comment {
                ...CoreCommentFields
              }
            }
            total
          }
        }
      `,
      variables: { queryOptions }
    });
  }

  public createComment(comment: CommentInput): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        ${this.CORE_COMMENT_FIELDS}
        mutation CreateComment($comment: CommentInput!) {
          createComment(comment: $comment) {
            ...CoreCommentFields
          }
        }
      `,
      variables: { comment }
    });
  }

  public editComment(id: string, comment: CommentInput): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        ${this.CORE_COMMENT_FIELDS}
        mutation EditComment($id: ID!, $comment: CommentInput!) {
          editComment(id: $id, comment: $comment) {
            ...CoreCommentFields
          }
        }
      `,
      variables: { id, comment }
    });
  }

  public deleteComment(id: string): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation DeleteComment($id: ID!) {
          deleteComment(id: $id) {
            id
          }
        }
      `,
      variables: { id }
    });
  }

  CORE_COMMENT_FIELDS: any = gql`
    fragment CoreCommentFields on Comment {
      id
      createdAt
      modifiedAt
      createdBy
      modifiedBy
      deleted
      creator
      description
      edited
    }
  `;
}
