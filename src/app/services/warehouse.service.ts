import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Warehouse} from "../models/warehouse";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private BaseUrl = `${environment.apiUrl}/warehouse`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<Warehouse[]> {
    return this.httpClient.get<Warehouse[]>(`${this.BaseUrl}`);
  }

  create(obj: Warehouse): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: Warehouse): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<Warehouse> {
    return this.httpClient.get<Warehouse>(`${this.BaseUrl}/${id}`);
  }
}
