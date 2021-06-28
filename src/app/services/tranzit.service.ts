import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Tranzit} from "../models/tranzit";

@Injectable({
  providedIn: 'root'
})
export class TranzitService {

  private BaseUrl = `${environment.apiUrl}/tranzit`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<Tranzit[]> {
    return this.httpClient.get<Tranzit[]>(`${this.BaseUrl}`);
  }

  create(obj: Tranzit): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: Tranzit): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<Tranzit> {
    return this.httpClient.get<Tranzit>(`${this.BaseUrl}/${id}`);
  }
}
