import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Warehouse} from '../models/warehouse';
import {Route} from '../models/route';

export interface WarehouseBackendApi {
  items: Warehouse[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private BaseUrl = `${environment.apiUrl}/warehouse`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<WarehouseBackendApi[]> {
    return this.httpClient.get<WarehouseBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  create(obj: Warehouse): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: Warehouse): Observable<Object> {
    return this.httpClient.put(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<Warehouse> {
    return this.httpClient.get<Warehouse>(`${this.BaseUrl}/${id}`);
  }

  getByCityId(id: number): Observable<Warehouse[]> {
    return this.httpClient.get<Warehouse[]>(`${this.BaseUrl}/byCityId/${id}`);
  }
}
