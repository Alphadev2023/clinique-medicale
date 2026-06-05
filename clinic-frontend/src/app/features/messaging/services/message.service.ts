import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Message, MessageRequest } from '../models/message.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private api = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  envoyer(req: MessageRequest): Observable<Message> {
    return this.http.post<Message>(this.api, req);
  }

  getConversation(userId1: string, userId2: string): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.api}/conversation?userId1=${userId1}&userId2=${userId2}`,
    );
  }

  getNonLus(userId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.api}/non-lus/${userId}`);
  }

  getNotifications(userId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.api}/notifications/${userId}`);
  }

  countNonLus(userId: string): Observable<number> {
    return this.http.get<number>(`${this.api}/count-non-lus/${userId}`);
  }

  marquerLu(id: string): Observable<void> {
    return this.http.patch<void>(`${this.api}/${id}/lu`, {});
  }

  marquerTousLus(userId: string): Observable<void> {
    return this.http.patch<void>(`${this.api}/tous-lus/${userId}`, {});
  }
}
