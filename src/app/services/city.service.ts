import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {City} from "../models/city";

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private BaseUrl = `${environment.apiUrl}/city`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<City[]> {
    return this.httpClient.get<City[]>(`${this.BaseUrl}`);
  }

  create(obj: City): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: City): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<City> {
    return this.httpClient.get<City>(`${this.BaseUrl}/${id}`);
  }
}
