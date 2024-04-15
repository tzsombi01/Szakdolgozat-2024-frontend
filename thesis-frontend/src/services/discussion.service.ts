import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryOptions } from 'src/models/query-options';
import { DiscussionInput } from 'src/models/discussion'; 
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getDiscussions(queryOptions: QueryOptions): Observable<any> {
    return this.http.post(`${this.BASE_URL}/discussions`, queryOptions);
  }

  public createDiscussion(discussion: DiscussionInput): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/discussions`, discussion);
  }

  public editDiscussion(id: string, discussion: DiscussionInput): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/discussions/${id}`, discussion);
  }

  public deleteDiscussion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/discussions/${id}`);
  }
}
