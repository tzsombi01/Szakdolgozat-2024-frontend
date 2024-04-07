import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { DocumentationInput } from 'src/models/documentation';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  constructor(private apollo: Apollo) { }

  public getDocumentations(queryOptions: QueryOptions): Observable<any> {
    return this.apollo.query<any>({
      query: gql`
        ${this.CORE_DOCUMENTATION_FIELDS}
        query GetDocumentations($queryOptions: QueryOptions!) {
          getDocumentations(queryOptions: $queryOptions) {
            content {
              ... on Documentation {
                ...CoreDocumentationFields
              }
            }
            total
          }
        }
      `,
      variables: { queryOptions }
    });
  }

  public createDocumentation(documentation: DocumentationInput): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        ${this.CORE_DOCUMENTATION_FIELDS}
        mutation CreateDocumentation($documentation: DocumentationInput!) {
          createDocumentation(documentation: $documentation) {
            ...CoreDocumentationFields
          }
        }
      `,
      variables: { documentation }
    });
  }

  public editDocumentation(id: string, documentation: DocumentationInput): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        ${this.CORE_DOCUMENTATION_FIELDS}
        mutation EditDocumentation($id: ID!, $documentation: DocumentationInput!) {
          editDocumentation(id: $id, documentation: $documentation) {
            ...CoreDocumentationFields
          }
        }
      `,
      variables: { id, documentation }
    });
  }

  public deleteDocumentation(id: string): Observable<any> {
    return this.apollo.mutate<any>({
      mutation: gql`
        mutation DeleteDocumentation($id: ID!) {
          deleteDocumentation(id: $id) {
            id
          }
        }
      `,
      variables: { id }
    });
  }

  CORE_DOCUMENTATION_FIELDS: any = gql`
    fragment CoreDocumentationFields on Documentation {
      id
      createdAt
      modifiedAt
      createdBy
      modifiedBy
      deleted
      creator
      description
      name
      comments
    }
  `;
}
