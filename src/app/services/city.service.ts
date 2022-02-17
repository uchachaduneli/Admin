import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {City} from '../models/city';

export interface CityBackendApi {
  items: City[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private BaseUrl = `${environment.apiUrl}/city`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<CityBackendApi[]> {
    return this.httpClient.get<CityBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
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

  getExcel(params: string): string {
    return `${this.BaseUrl}/excel?${params}`;
  }
}
