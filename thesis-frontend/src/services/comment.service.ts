import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommentInput } from 'src/models/comment';
import { QueryOptions } from 'src/models/query-options';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getComments(queryOptions: QueryOptions): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post(`${this.BASE_URL}/api/comments/get`, queryOptions, requestHeaders);
  }

  public createComment(comment: CommentInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post<any>(`${this.BASE_URL}/api/comments`, comment, requestHeaders);
  }

  public editComment(id: string, comment: CommentInput): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.put<any>(`${this.BASE_URL}/api/comments/${id}`, comment, requestHeaders);
  }

  public deleteComment(id: string): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    
    return this.http.delete<any>(`${this.BASE_URL}/api/comments/${id}`, requestHeaders);
  }
}
