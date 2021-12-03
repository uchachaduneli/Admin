import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Route} from '../models/route';
import {Message} from '../models/message';
import {MessageCc} from '../models/message-cc';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private BaseUrl = `${environment.apiUrl}/messages`;

  constructor(private httpClient: HttpClient) {
  }

  create(obj: Route): Observable<Message> {
    return this.httpClient.post<Message>(`${this.BaseUrl}`, obj);
  }

  update(obj: Route): Observable<Object> {
    return this.httpClient.post(`${this.BaseUrl}`, obj);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.BaseUrl}/${id}`);
  }

  getMessageCCByMessageId(id: number): Observable<MessageCc> {
    return this.httpClient.get<MessageCc>(`${this.BaseUrl}/messageCC/${id}`);
  }

  getByParcelId(id: number): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.BaseUrl}/${id}`);
  }
}
