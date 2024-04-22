import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QueryOptions } from 'src/models/query-options';
import { User, UserInput } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly BASE_URL: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  private getLoggedInUser(): Observable<any> {
    return this.http.get<User>(`${this.BASE_URL}/api/users/me`);
  }
  
  getUsers(queryOptions: QueryOptions): Observable<any> {
    return this.http.post<User>(`${this.BASE_URL}/api/users`, queryOptions);
  }

  editUser(id: string, user: UserInput): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/api/users`, { id, user });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/api/users?id=${id}`);
  }

  register(user: UserInput): Observable<any> {
    return this.http.post<User>(`${this.BASE_URL}/api/auth/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/api/auth/login`, { email, password });
  }
}
