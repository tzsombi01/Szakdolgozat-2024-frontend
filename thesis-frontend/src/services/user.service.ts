import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QueryOptions } from 'src/models/query-options';
import { UserInput } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly BASE_URL: string = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
  }
  
  getLoggedInUser(token: string): Observable<any> {
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };
    console.log("Loggedingetting");
    console.log(requestHeaders);
    return this.http.get<any>(`${this.BASE_URL}/api/users/me`, requestHeaders);
  }
  
  getUsers(queryOptions: QueryOptions, token: string): Observable<any> {
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.post<any>(`${this.BASE_URL}/api/users`, { queryOptions }, requestHeaders);
  }

  editUser(id: string, user: UserInput, token: string): Observable<any> {
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.put<any>(`${this.BASE_URL}/api/users`, { id, user }, requestHeaders);
  }

  deleteUser(id: string, token: string): Observable<any> {
    let authHeader = new HttpHeaders({ Authorization: "Bearer " + token });
    const requestHeaders = { headers: authHeader };

    return this.http.delete<any>(`${this.BASE_URL}/api/users?id=${id}`, requestHeaders);
  }

  register(user: UserInput): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/api/auth/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    console.log(email, password)
    return this.http.post<any>(`${this.BASE_URL}/api/auth/login`, { email, password });
  }
}
