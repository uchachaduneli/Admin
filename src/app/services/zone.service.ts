import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Zone} from "../models/zone";

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private BaseUrl = `${environment.apiUrl}/zone`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<Zone[]> {
    return this.httpClient.get<Zone[]>(`${this.BaseUrl}`);
  }

  create(obj: Zone): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: Zone): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<Zone> {
    return this.httpClient.get<Zone>(`${this.BaseUrl}/${id}`);
  }
}
