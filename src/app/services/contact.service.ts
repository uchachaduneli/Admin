import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Contact} from '../models/contact';

export interface ContactBackendApi {
  items: Contact[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private BaseUrl = `${environment.apiUrl}/contact`;

  constructor(private httpClient: HttpClient) {
  }
  getList(rowcount: number, page: number, srchParams: string): Observable<ContactBackendApi[]> {
    return this.httpClient.get<ContactBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  create(obj: Contact): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  update(obj: Contact): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<Contact> {
    return this.httpClient.get<Contact>(`${this.BaseUrl}/${id}`);
  }
}
