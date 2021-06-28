import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Route} from "../models/route";

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private BaseUrl = `${environment.apiUrl}/route`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<Route[]> {
    return this.httpClient.get<Route[]>(`${this.BaseUrl}`);
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
}
