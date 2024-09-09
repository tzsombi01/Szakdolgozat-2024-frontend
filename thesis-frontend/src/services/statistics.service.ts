import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProgrammerStatisticsRequest } from 'src/models/programmer-statistics';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  
  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getProgrammerStatistics(projectId: string, programmerStatisticsRequest: ProgrammerStatisticsRequest): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    
    return this.http.post<any>(`${this.BASE_URL}/api/statistics/${projectId}`, programmerStatisticsRequest, requestHeaders);
  }
}
