import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QueryOptions } from 'src/models/query-options';
import { StatusInput } from 'src/models/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getStatuses(queryOptions: QueryOptions): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post(`${this.BASE_URL}/api/statuses/get`, queryOptions, requestHeaders);
  }

  public getStatus(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    
    return this.http.get<any>(`${this.BASE_URL}/api/statuses/${id}`, requestHeaders);
  }

  public createStatus(status: StatusInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post<any>(`${this.BASE_URL}/api/statuses`, status, requestHeaders);
  }

  public editStatus(id: string, status: StatusInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.put<any>(`${this.BASE_URL}/api/statuses/${id}`, status, requestHeaders);
  }

  public deleteStatus(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.delete<any>(`${this.BASE_URL}/api/statuses/${id}`, requestHeaders);
  }
}
