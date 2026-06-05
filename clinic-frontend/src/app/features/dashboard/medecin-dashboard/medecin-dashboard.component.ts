import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import {
  LucideAngularModule,
  Users,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  CalendarPlus,
  FilePlus,
} from 'lucide-angular';

@Component({
  selector: 'app-medecin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './medecin-dashboard.component.html',
})
export class MedecinDashboardComponent implements OnInit {
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly ArrowRight = ArrowRight;
  readonly CalendarPlus = CalendarPlus;
  readonly FilePlus = FilePlus;

  stats = signal({
    totalPatients: 0,
    rdvAujourdhui: 0,
    rdvSemaine: 0,
    prescriptionsActives: 0,
    rdvPlanifies: 0,
    rdvTermines: 0,
  });

  prochainRdv = signal<any[]>([]);
  recentPatients = signal<any[]>([]);
  loading = signal(true);
  medecinId = signal('');

  constructor(
    private http: HttpClient,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const id = this.authService.currentUser()?.id || '';
    this.medecinId.set(id);
    this.loadStats(id);
  }

  loadStats(medecinId: string) {
    const api = environment.apiUrl;

    this.http.get<any[]>(`${api}/appointments/medecin/${medecinId}`).subscribe({
      next: (rdvs) => {
        const today = new Date().toISOString().split('T')[0];
        const next7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const rdvAujourdhui = rdvs.filter(
          (r) => r.debut.startsWith(today) && r.status !== 'ANNULE',
        ).length;

        const rdvSemaine = rdvs.filter(
          (r) =>
            r.debut >= today && r.debut <= next7days && r.status !== 'ANNULE',
        ).length;

        const rdvPlanifies = rdvs.filter(
          (r) => r.status === 'PLANIFIE' || r.status === 'CONFIRME',
        ).length;

        const rdvTermines = rdvs.filter((r) => r.status === 'TERMINE').length;

        this.stats.update((s) => ({
          ...s,
          rdvAujourdhui,
          rdvSemaine,
          rdvPlanifies,
          rdvTermines,
        }));

        // Prochains RDV
        const upcoming = rdvs
          .filter((r) => r.debut >= today && r.status !== 'ANNULE')
          .sort((a, b) => a.debut.localeCompare(b.debut))
          .slice(0, 5);
        this.prochainRdv.set(upcoming);
        this.loading.set(false);
      },
    });

    // Patients du médecin via prescriptions
    this.http
      .get<any[]>(`${api}/prescriptions/medecin/${medecinId}`)
      .subscribe({
        next: (prescriptions) => {
          const actives = prescriptions.filter(
            (p) => p.status === 'ACTIVE',
          ).length;
          const patientIds = [
            ...new Set(prescriptions.map((p) => p.patientId)),
          ];
          this.stats.update((s) => ({
            ...s,
            totalPatients: patientIds.length,
            prescriptionsActives: actives,
          }));
        },
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLANIFIE':
        return 'badge-info';
      case 'CONFIRME':
        return 'badge-success';
      case 'TERMINE':
        return 'bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full';
      case 'ANNULE':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PLANIFIE':
        return 'Planifié';
      case 'CONFIRME':
        return 'Confirmé';
      case 'TERMINE':
        return 'Terminé';
      case 'ANNULE':
        return 'Annulé';
      default:
        return status;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
