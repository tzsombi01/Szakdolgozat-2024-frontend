import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { DocumentationInput } from 'src/models/documentation';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getDocumentations(queryOptions: QueryOptions): Observable<any> {
    return this.http.post('/documentations', queryOptions);
  }

  public createDocumentation(documentation: DocumentationInput): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/documentations`, documentation);
  }

  public editDocumentation(id: string, documentation: DocumentationInput): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/documentations/${id}`, documentation);
  }

  public deleteDocumentation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/documentations/${id}`);
  }
}
