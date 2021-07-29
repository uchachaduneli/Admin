import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Route} from '../models/route';

export interface RouteBackendApi {
  items: Route[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private BaseUrl = `${environment.apiUrl}/route`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<RouteBackendApi[]> {
    return this.httpClient.get<RouteBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  create(obj: Route): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: Route): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<Route> {
    return this.httpClient.get<Route>(`${this.BaseUrl}/${id}`);
  }

  getByCityId(id: number): Observable<Route[]> {
    return this.httpClient.get<Route[]>(`${this.BaseUrl}/byCityId/${id}`);
  }
}
