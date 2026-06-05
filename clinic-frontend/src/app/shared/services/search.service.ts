import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { forkJoin, map, Observable } from 'rxjs';

export interface SearchResult {
  id: string;
  titre: string;
  subtitle: string;
  type: 'patient' | 'appointment' | 'prescription';
  route: string[];
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<SearchResult[]> {
    return forkJoin({
      patients: this.http.get<any[]>(
        `${environment.apiUrl}/patients/search?q=${query}`,
      ),
      appointments: this.http.get<any[]>(`${environment.apiUrl}/appointments`),
    }).pipe(
      map(({ patients, appointments }) => {
        const results: SearchResult[] = [];

        // Patients
        patients.forEach((p) => {
          results.push({
            id: p.id,
            titre: `${p.prenom} ${p.nom}`,
            subtitle: p.email,
            type: 'patient',
            route: ['/patients', p.id],
          });
        });

        // Appointments filtrés
        const q = query.toLowerCase();
        appointments
          .filter(
            (a) =>
              a.motif?.toLowerCase().includes(q) ||
              a.salle?.toLowerCase().includes(q),
          )
          .slice(0, 3)
          .forEach((a) => {
            results.push({
              id: a.id,
              titre: a.motif || 'Consultation',
              subtitle: new Date(a.debut).toLocaleDateString('fr-FR'),
              type: 'appointment',
              route: ['/appointments'],
            });
          });

        return results.slice(0, 8);
      }),
    );
  }
}
