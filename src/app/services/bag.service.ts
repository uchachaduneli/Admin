import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bag} from '../models/bag';

export interface BagBackendApi {
  items: Bag[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class BagService {
  private BaseUrl = `${environment.apiUrl}/bags`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<BagBackendApi[]> {
    return this.httpClient.get<BagBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  // tslint:disable-next-line:ban-types
  create(obj: Bag): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  // tslint:disable-next-line:ban-types
  update(obj: Bag): Observable<Object> {
    return this.httpClient.put(`${this.BaseUrl}`, obj);
  }



  getById(id: number): Observable<Bag> {
    return this.httpClient.get<Bag>(`${this.BaseUrl}/${id}`);
  }

  getBarCode(): Observable<string> {
    return this.httpClient.get<string>(`${this.BaseUrl}/barcode`);
  }

  // tslint:disable-next-line:ban-types
  getByBarCode(barcode: string): Observable<Bag> {
    return this.httpClient.get<Bag>(`${this.BaseUrl}/byBarCode/${barcode}`);
  }
}
