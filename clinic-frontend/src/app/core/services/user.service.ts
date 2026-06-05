import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface UserSummary {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getMedecins(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(`${this.api}/medecins`);
  }

  getAll(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(this.api);
  }

  toggleActif(id: string): Observable<UserSummary> {
    return this.http.put<UserSummary>(`${this.api}/${id}/toggle`, {});
  }
}
