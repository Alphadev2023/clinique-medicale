import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  Prescription,
  PrescriptionRequest,
} from '../models/prescription.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private api = `${environment.apiUrl}/prescriptions`;

  constructor(private http: HttpClient) {}

  parPatient(patientId: string): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.api}/patient/${patientId}`);
  }

  parMedecin(medecinId: string): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.api}/medecin/${medecinId}`);
  }

  getById(id: string): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.api}/${id}`);
  }

  creer(req: PrescriptionRequest): Observable<Prescription> {
    return this.http.post<Prescription>(this.api, req);
  }

  annuler(id: string): Observable<Prescription> {
    return this.http.patch<Prescription>(`${this.api}/${id}/annuler`, {});
  }

  parAppointment(appointmentId: string): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(
      `${this.api}/appointment/${appointmentId}`,
    );
  }

  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.api}/${id}/pdf`, {
      responseType: 'blob',
    });
  }
}
