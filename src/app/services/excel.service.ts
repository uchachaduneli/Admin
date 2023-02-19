import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ExcelTmpParcel} from '../models/ExcelTmpParcel';

export interface ExcelTmpParcelBackendApi {
  items: ExcelTmpParcel[];
  total_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private BaseUrl = `${environment.apiUrl}/excel`;

  constructor(private httpClient: HttpClient) {
  }

  getList(rowcount: number, page: number, srchParams: string): Observable<ExcelTmpParcelBackendApi[]> {
    return this.httpClient.get<ExcelTmpParcelBackendApi[]>(`${this.BaseUrl}?rowCount=${rowcount}&page=${page}`);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  deleteAll(): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/all`);
  }

  upload(file: File, senderId: any, routeId: any,
         authorId: any, cityId: any,
         address: any, contactPerson: any, contactPhone: any, serviceId: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('senderId', senderId);
    formData.append('routeId', routeId);
    formData.append('authorId', authorId);
    formData.append('cityId', cityId);
    formData.append('address', address);
    formData.append('contactPerson', contactPerson);
    formData.append('contactPhone', contactPhone);
    formData.append('serviceId', serviceId);
    const req = new HttpRequest('POST', `${this.BaseUrl}/import`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }


  moveToMainTable(senderIdentNum: string): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}/move-to-main?senderIdentNum=${senderIdentNum}`, null);
  }

  getExcel(userId: number): string {
    return `${this.BaseUrl}/excel?userId=${userId}`;
  }
}
