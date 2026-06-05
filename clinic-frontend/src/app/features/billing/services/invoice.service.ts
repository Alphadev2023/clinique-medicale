import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Invoice, InvoiceRequest } from '../models/invoice.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private api = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  listerToutes(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.api);
  }

  getById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.api}/${id}`);
  }

  parPatient(patientId: string): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.api}/patient/${patientId}`);
  }

  impayees(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.api}/impayees`);
  }

  creer(req: InvoiceRequest): Observable<Invoice> {
    return this.http.post<Invoice>(this.api, req);
  }

  paiement(id: string, montant: number): Observable<Invoice> {
    return this.http.patch<Invoice>(
      `${this.api}/${id}/paiement?montant=${montant}`,
      {},
    );
  }

  annuler(id: string): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.api}/${id}/annuler`, {});
  }

  totalRevenus(): Observable<number> {
    return this.http.get<number>(`${this.api}/stats/revenus`);
  }

  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.api}/${id}/pdf`, {
      responseType: 'blob',
    });
  }
}
