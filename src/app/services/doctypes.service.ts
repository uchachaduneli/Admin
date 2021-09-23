import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Parcel} from '../models/parcel';

export interface DoctypeBackendApi {
  items: Parcel[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DoctypesService {

  private BaseUrl = `${environment.apiUrl}/doctype`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<DoctypeBackendApi[]> {
    return this.httpClient.get<DoctypeBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  // tslint:disable-next-line:ban-types
  create(obj: Parcel): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  update(obj: Parcel): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  // tslint:disable-next-line:ban-types
  getById(id: number): Observable<Parcel> {
    return this.httpClient.get<Parcel>(`${this.BaseUrl}/${id}`);
  }
}
