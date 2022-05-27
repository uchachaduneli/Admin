import {Injectable} from '@angular/core';
import {Parcel} from '../models/parcel';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {VolumeWeightIndex} from '../models/volume-weight-index';
import {Packages} from '../models/packages';
import {ParcelStatusHistory} from '../models/parcel-status-history';
import {DeliveryDetailParcelDTO} from '../models/delivery-detail-parcel-dto';

export interface ParcelBackendApi {
  items: Parcel[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParcelService {

  private BaseUrl = `${environment.apiUrl}/parcel`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<ParcelBackendApi[]> {
    return this.httpClient.get<ParcelBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  // tslint:disable-next-line:ban-types
  create(obj: Parcel): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  update(obj: Parcel): Observable<Object> {
    return this.httpClient.put(`${this.BaseUrl}/${obj.id}`, obj);
  }

  // tslint:disable-next-line:ban-types
  updateDeliveryDetailParcel(obj: DeliveryDetailParcelDTO): Observable<Object> {
    return this.httpClient.put(`${this.BaseUrl}/deliveryDetailParcel`, obj);
  }

  // tslint:disable-next-line:ban-types
  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  // tslint:disable-next-line:ban-types
  getById(id: number): Observable<Parcel> {
    return this.httpClient.get<Parcel>(`${this.BaseUrl}/${id}`);
  }

  // tslint:disable-next-line:ban-types
  getByBarCode(barcode: string): Observable<Parcel> {
    return this.httpClient.get<Parcel>(`${this.BaseUrl}/byBarCode/${barcode}`);
  }

  getWithPackagesWhereIdIn(ides: string): Observable<Parcel> {
    return this.httpClient.get<Parcel>(`${this.BaseUrl}/byIdesIn?ides=${ides}`);
  }

  getVolumeWeightIndex(): Observable<VolumeWeightIndex> {
    return this.httpClient.get<VolumeWeightIndex>(`${this.BaseUrl}/volumeWeightIndex`);
  }

  // tslint:disable-next-line:ban-types
  updateVolumeWeightIndex(obj: VolumeWeightIndex): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}/volumeWeightIndex`, obj);
  }

  // tslint:disable-next-line:ban-types
  createPackages(obj: Packages[]): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}/package`, obj);
  }

  // tslint:disable-next-line:ban-types
  updatePackages(obj: Packages[]): Observable<Object> {
    return this.httpClient.put(`${this.BaseUrl}/package`, obj);
  }

  getByPackageId(id: number): Observable<Packages> {
    return this.httpClient.get<Packages>(`${this.BaseUrl}/package/${id}`);
  }

  // tslint:disable-next-line:ban-types
  preGeneration(count: number): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}/prePrint/${count}`, {});
  }

  getStatusHistoryByParceId(id: number): Observable<ParcelStatusHistory> {
    return this.httpClient.get<ParcelStatusHistory>(`${this.BaseUrl}/statusHistory/${id}`);
  }

  // tslint:disable-next-line:ban-types
  changeMultiplesStatuses(obj: any): Observable<Object> {
    return this.httpClient.put(`${this.BaseUrl}/multipleStatusUpdate/${obj.statusId}/${obj.note}`, obj.barCodes);
  }
}
