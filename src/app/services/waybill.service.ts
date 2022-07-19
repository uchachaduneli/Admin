import {Injectable} from '@angular/core';
import {Waybill} from '../models/waybill';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface WayBillBackendApi {
  items: Waybill[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class WaybillService {
  private BaseUrl = `${environment.apiUrl}/rs`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<WayBillBackendApi[]> {
    return this.httpClient.get<WayBillBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  getById(id: number): Observable<Waybill> {
    return this.httpClient.get<Waybill>(`${this.BaseUrl}/${id}`);
  }
}
