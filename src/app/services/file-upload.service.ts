import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Files} from '../models/files';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) {
  }

  upload(file: File, parcelId: any, key?: string, value?: any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    if (key) {
      formData.append(key, value);
    }
    if (parcelId) {
      formData.append('parcelId', parcelId);
    }
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getFiles(parcelId?: number): Observable<Files[]> {
    let url = `${this.baseUrl}`;
    if (parcelId) {
      url = `${this.baseUrl}?parcelId=${parcelId}`;
    }
    return this.http.get<Files[]>(`${url}`);
  }

  // tslint:disable-next-line:ban-types
  delete(fileName: string): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/${fileName}`);
  }
}
