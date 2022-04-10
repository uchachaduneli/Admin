import {Injectable} from '@angular/core';
import {DeliveryDetail} from '../models/delivery-detail';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface DeliveryDetailBackendApi {
  items: DeliveryDetail[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryDetailsService {
  private BaseUrl = `${environment.apiUrl}/deliveryDetails`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<DeliveryDetailBackendApi[]> {
    return this.httpClient.get<DeliveryDetailBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  create(obj: DeliveryDetail): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<DeliveryDetail> {
    return this.httpClient.get<DeliveryDetail>(`${this.BaseUrl}/${id}`);
  }

  getBarCode(): Observable<string> {
    return this.httpClient.get<string>(`${this.BaseUrl}/barcode`);
  }
}
