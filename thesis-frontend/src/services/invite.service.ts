import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InviteInput } from 'src/models/invite';
import { QueryOptions } from 'src/models/query-options';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getInvites(queryOptions: QueryOptions): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post(`${this.BASE_URL}/api/invites/get`, queryOptions, requestHeaders);
  }

  public acceptInvite(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post<any>(`${this.BASE_URL}/api/invites`, id, requestHeaders);
  }

  public editInvite(id: string, invite: InviteInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.put<any>(`${this.BASE_URL}/api/invites/${id}`, invite, requestHeaders);
  }

  public declineInvite(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    
    return this.http.delete<any>(`${this.BASE_URL}/api/invites/${id}`, requestHeaders);
  }
}
