import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NotificationInput } from 'src/models/notification';
import { QueryOptions } from 'src/models/query-options';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getNotifications(queryOptions: QueryOptions): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post(`${this.BASE_URL}/api/notifications/get`, queryOptions, requestHeaders);
  }

  public createNotification(notification: NotificationInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post<any>(`${this.BASE_URL}/api/notifications`, notification, requestHeaders);
  }

  public editNotification(id: string, notification: NotificationInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.put<any>(`${this.BASE_URL}/api/notifications/${id}`, notification, requestHeaders);
  }

  public deleteNotification(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    
    return this.http.delete<any>(`${this.BASE_URL}/api/notifications/${id}`, requestHeaders);
  }
}
