import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { DiscussionInput } from 'src/models/discussion'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getDiscussions(queryOptions: QueryOptions): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post(`${this.BASE_URL}/api/discussions/get`, queryOptions, requestHeaders);
  }

  public getDiscussion(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    
    return this.http.get<any>(`${this.BASE_URL}/api/discussions/${id}`, requestHeaders);
  }

  public createDiscussion(discussion: DiscussionInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    
    return this.http.post<any>(`${this.BASE_URL}/api/discussions`, discussion, requestHeaders);
  }

  public editDiscussion(id: string, discussion: DiscussionInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.put<any>(`${this.BASE_URL}/api/discussions/${id}`, discussion, requestHeaders);
  }

  public deleteDiscussion(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.delete<any>(`${this.BASE_URL}/api/discussions/${id}`, requestHeaders);
  }
}
