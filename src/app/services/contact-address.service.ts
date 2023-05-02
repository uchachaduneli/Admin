import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ContactAddress} from '../models/contact-address';

export interface ContactAddressBackendApi {
  items: ContactAddress[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContactAddressService {

  private BaseUrl = `${environment.apiUrl}/contactAddress`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<ContactAddressBackendApi[]> {
    return this.httpClient.get<ContactAddressBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  // tslint:disable-next-line:ban-types
  create(obj: ContactAddress): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  update(obj: ContactAddress): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<ContactAddress> {
    return this.httpClient.get<ContactAddress>(`${this.BaseUrl}/${id}`);
  }

  getByContactId(id: number): Observable<ContactAddress> {
    return this.httpClient.get<ContactAddress>(`${this.BaseUrl}/contact/${id}`);
  }

  getContactPayAddresses(id: number): Observable<ContactAddress> {
    return this.httpClient.get<ContactAddress>(`${this.BaseUrl}/contactPayAddresses/${id}`);
  }
}
