import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ContactAddress} from "../models/contact-address";

@Injectable({
  providedIn: 'root'
})
export class ContactAddressService {

  private BaseUrl = `${environment.apiUrl}/contactAddress`;

  constructor(private httpClient: HttpClient) {
  }

  getList(): Observable<ContactAddress[]> {
    return this.httpClient.get<ContactAddress[]>(`${this.BaseUrl}`);
  }

  create(obj: ContactAddress): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: ContactAddress): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<ContactAddress> {
    return this.httpClient.get<ContactAddress>(`${this.BaseUrl}/${id}`);
  }

  getByContactId(id: number): Observable<ContactAddress> {
    return this.httpClient.get<ContactAddress>(`${this.BaseUrl}/contact/${id}`);
  }
}
