import {Injectable} from '@angular/core';
import {Parcel} from '../models/parcel';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Contact} from '../models/contact';
import {VolumeWeightIndex} from '../models/volume-weight-index';
import {Packages} from '../models/packages';
import {ContactAddress} from '../models/contact-address';

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
}
