import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {environment} from '../../environments/environment';

export interface UserBackendApi {
  items: User[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BaseUrl = `${environment.apiUrl}/user`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<UserBackendApi[]> {
    return this.httpClient.get<UserBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  create(user: User): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, user);
  }

  update(user: User): Observable<Object> {
    return this.httpClient.put(`${this.BaseUrl}`, user);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.BaseUrl}/${id}`);
  }

  getByHavingRoles(roles: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.BaseUrl}/byRoles?roles=${roles}`);
  }

}
