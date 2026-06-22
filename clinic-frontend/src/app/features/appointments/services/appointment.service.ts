import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Appointment, AppointmentRequest } from '../models/appointment.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private api = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  listerTous(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.api);
  }

  parMedecin(medecinId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.api}/medecin/${medecinId}`);
  }

  parPatient(patientId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.api}/patient/${patientId}`);
  }

  creer(req: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(this.api, req);
  }

  confirmer(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.api}/${id}/confirmer`, {});
  }

  annuler(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.api}/${id}/annuler`, {});
  }

  terminer(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.api}/${id}/terminer`, {});
  }
  listerParMedecin(medecinId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.api}/medecin/${medecinId}`);
  }
}
