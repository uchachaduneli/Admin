import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Tariff} from '../models/tariff';
import {TariffDetail} from '../models/tariff-detail';
import {ContactAddress} from '../models/contact-address';
import {ContactAddressBackendApi} from './contact-address.service';

export interface TariffBackendApi {
  items: Tariff[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class TariffService {
  private BaseUrl = `${environment.apiUrl}/tariff`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<TariffBackendApi[]> {
    return this.httpClient.get<TariffBackendApi[]>(`${this.BaseUrl}`);
  }

  // tslint:disable-next-line:ban-types
  create(obj: Tariff): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  update(obj: Tariff): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<Tariff> {
    return this.httpClient.get<Tariff>(`${this.BaseUrl}/${id}`);
  }

  // tslint:disable-next-line:ban-types
  createTariffDetails(list: TariffDetail[]): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}/detailsList`, list);
  }

  // tslint:disable-next-line:ban-types
  updateTariffDetails(list: TariffDetail[]): Observable<Object> {
    return this.httpClient.put(`${this.BaseUrl}/detailsList`, list);
  }

  // tslint:disable-next-line:ban-types
  deleteTariffDetails(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getByTariffId(id: number): Observable<TariffDetail[]> {
    return this.httpClient.get<TariffDetail[]>(`${this.BaseUrl}/details/${id}`);
  }
}
