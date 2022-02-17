import {Injectable} from '@angular/core';
import {ParcelStatus} from '../models/parcel-status';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ParcelStatusReason} from '../models/parcel-status-reason';

export interface ParcelStatusBackendApi {
  items: ParcelStatus[];
  total_count: number;
}

export interface ParcelStatusReasonBackApi {
  items: ParcelStatusReason[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParcelStatusService {

  private BaseUrl = `${environment.apiUrl}/parcelStatus`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<ParcelStatusBackendApi[]> {
    return this.httpClient.get<ParcelStatusBackendApi[]>(`${this.BaseUrl}`);
  }

  // tslint:disable-next-line:ban-types
  create(obj: ParcelStatus): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  update(obj: ParcelStatus): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getByParcelStatusId(id: number): Observable<ParcelStatusReasonBackApi[]> {
    return this.httpClient.get<ParcelStatusReasonBackApi[]>(`${this.BaseUrl}/statusReason/${id}`);
  }

  getAllStatusReasons(): Observable<ParcelStatusReasonBackApi[]> {
    return this.httpClient.get<ParcelStatusReasonBackApi[]>(`${this.BaseUrl}/statusReason`);
  }

  // tslint:disable-next-line:ban-types
  createReason(obj: ParcelStatusReason): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}/statusReason`, obj);
  }

  // tslint:disable-next-line:ban-types
  updateReason(obj: ParcelStatusReason): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}/statusReason`, obj);
  }

  // tslint:disable-next-line:ban-types
  deleteReason(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/statusReason/${id}`);
  }

  getExcel(params: string): string {
    return `${this.BaseUrl}/excel?${params}`;
  }
}
