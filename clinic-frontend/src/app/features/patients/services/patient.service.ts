import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Patient, PatientRequest } from '../models/patient.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private api = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  lister(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.api);
  }

  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.api}/${id}`);
  }

  creer(req: PatientRequest): Observable<Patient> {
    return this.http.post<Patient>(this.api, req);
  }

  modifier(id: string, req: PatientRequest): Observable<Patient> {
    return this.http.put<Patient>(`${this.api}/${id}`, req);
  }

  supprimer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  rechercher(q: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.api}/search?q=${q}`);
  }
}
