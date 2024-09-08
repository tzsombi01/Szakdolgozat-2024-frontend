import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { DocumentationInput } from 'src/models/documentation';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getDocumentations(queryOptions: QueryOptions): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    
    return this.http.post(`${this.BASE_URL}/api/documentations/get`, queryOptions, requestHeaders);
  }

  public getDocumentation(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    
    return this.http.get<any>(`${this.BASE_URL}/api/documentations/${id}`, requestHeaders);
  }

  public createDocumentation(documentation: DocumentationInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post<any>(`${this.BASE_URL}/api/documentations`, documentation, requestHeaders);
  }

  public editDocumentation(id: string, documentation: DocumentationInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.put<any>(`${this.BASE_URL}/api/documentations/${id}`, documentation, requestHeaders);
  }

  public deleteDocumentation(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.delete<any>(`${this.BASE_URL}/api/documentations/${id}`, requestHeaders);
  }
}
