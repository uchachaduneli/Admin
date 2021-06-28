import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BaseUrl = `${environment.apiUrl}/user`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.BaseUrl}`);
  }

  create(user: User): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, user);
  }

  update(user: User): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, user);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.BaseUrl}/${id}`);
  }

}
