import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QueryOptions } from 'src/models/query-options';
import { TicketInput } from 'src/models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getTickets(queryOptions: QueryOptions): Observable<any> {
    return this.http.post(`${this.BASE_URL}/api/tickets/get`, queryOptions);
  }

  public createTicket(ticket: TicketInput): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/api/tickets`, ticket);
  }

  public editTicket(id: string, ticket: TicketInput): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/api/tickets?${id}`, ticket);
  }

  public deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/api/tickets?${id}`);
  }
}
