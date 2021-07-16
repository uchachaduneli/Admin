import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Zone} from '../models/zone';
import {CarBackendApi} from './car.service';

export interface ZoneBackendApi {
  items: Zone[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private BaseUrl = `${environment.apiUrl}/zone`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number): Observable<ZoneBackendApi[]> {
    return this.httpClient.get<ZoneBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}`);
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
