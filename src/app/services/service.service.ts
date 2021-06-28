import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Service} from "../models/service";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private BaseUrl = `${environment.apiUrl}/service`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<Service[]> {
    return this.httpClient.get<Service[]>(`${this.BaseUrl}`);
  }

  create(obj: Service): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: Service): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<Service> {
    return this.httpClient.get<Service>(`${this.BaseUrl}/${id}`);
  }
}
