import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Car} from '../models/car';

export interface CarBackendApi {
  items: Car[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private BaseUrl = `${environment.apiUrl}/car`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<CarBackendApi[]> {
    return this.httpClient.get<CarBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  create(obj: Car): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: Car): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}/${obj.id}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<Car> {
    return this.httpClient.get<Car>(`${this.BaseUrl}/${id}`);
  }
}
