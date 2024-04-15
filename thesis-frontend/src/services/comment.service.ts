import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
    return this.http.post(`${this.BASE_URL}/comments`, queryOptions);
  }

  public createComment(comment: CommentInput): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/comments`, comment);
  }

  public editComment(id: string, comment: CommentInput): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/comments/${id}`, comment);
  }

  public deleteComment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/comments/${id}`);
  }
}
