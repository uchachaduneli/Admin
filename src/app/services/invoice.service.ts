import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InvoiceDTO} from '../models/invoice-dto';
import {Parcel} from '../models/parcel';

export interface InvoiceDTOBackendApi {
  items: InvoiceDTO[];
  total_count: number;
}

export interface InvoiceParcelBackendApi {
  items: Parcel[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private BaseUrl = `${environment.apiUrl}/invoice`;

  constructor(private httpClient: HttpClient) {
  }

  getInvoicesList(rowcount: number, page: number, srchParams: string): Observable<InvoiceDTOBackendApi[]> {
    return this.httpClient.get<InvoiceDTOBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  getNotYetIinvoicesList(rowcount: number, page: number, srchParams: string): Observable<InvoiceDTOBackendApi[]> {
    return this.httpClient.get<InvoiceDTOBackendApi[]>(`${this.BaseUrl}/notYetGenerated?rowCount=${rowcount}&page=${page}&${srchParams}`);
  }

  getPayersUnInvoicedParcelsList(rowcount: number, page: number, identNumber: string): Observable<InvoiceParcelBackendApi[]> {
    return this.httpClient.get<InvoiceParcelBackendApi[]>(`${this.BaseUrl}/payerUnInvoicedParcels?identNumber=${identNumber}&rowCount=${rowcount}&page=${page}`);
  }

  // tslint:disable-next-line:ban-types
  create(obj: InvoiceDTO): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  update(obj: InvoiceDTO): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  // tslint:disable-next-line:ban-types
  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getById(id: number): Observable<InvoiceDTO> {
    return this.httpClient.get<InvoiceDTO>(`${this.BaseUrl}/${id}`);
  }

  getInvoiceStatuses(): Observable<string> {
    return this.httpClient.get<string>(`${this.BaseUrl}/statuses`);
  }

  getInvoicePaymentStatuses(): Observable<string> {
    return this.httpClient.get<string>(`${this.BaseUrl}/paymentStatuses`);
  }

  // tslint:disable-next-line:ban-types
  pay(obj: InvoiceDTO): Observable<Object> {
    return this.httpClient.put(`${this.BaseUrl}/pay`, obj);
  }

  // tslint:disable-next-line:ban-types
  sendEmail(obj: InvoiceDTO): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}/email`, obj);
  }
}
