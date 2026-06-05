import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import {
  LucideAngularModule,
  Calendar,
  Receipt,
  Clock,
  AlertCircle,
  ArrowRight,
  CalendarPlus,
  UserPlus,
  CreditCard,
} from 'lucide-angular';

@Component({
  selector: 'app-secretaire-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './secretaire-dashboard.component.html',
})
export class SecretaireDashboardComponent implements OnInit {
  readonly Calendar = Calendar;
  readonly Receipt = Receipt;
  readonly Clock = Clock;
  readonly AlertCircle = AlertCircle;
  readonly ArrowRight = ArrowRight;
  readonly CalendarPlus = CalendarPlus;
  readonly UserPlus = UserPlus;
  readonly CreditCard = CreditCard;

  stats = signal({
    rdvAujourdhui: 0,
    rdvSemaine: 0,
    facturesImpayees: 0,
    montantImpaye: 0,
    totalPatients: 0,
    rdvPlanifies: 0,
  });

  rdvAujourdhui = signal<any[]>([]);
  impayees = signal<any[]>([]);
  loading = signal(true);

  constructor(
    private http: HttpClient,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    const api = environment.apiUrl;

    // RDV
    this.http.get<any[]>(`${api}/appointments`).subscribe({
      next: (rdvs) => {
        const today = new Date().toISOString().split('T')[0];
        const next7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const aujourdhui = rdvs.filter(
          (r) => r.debut.startsWith(today) && r.status !== 'ANNULE',
        );
        const semaine = rdvs.filter(
          (r) =>
            r.debut >= today && r.debut <= next7days && r.status !== 'ANNULE',
        ).length;
        const planifies = rdvs.filter((r) => r.status === 'PLANIFIE').length;

        this.stats.update((s) => ({
          ...s,
          rdvAujourdhui: aujourdhui.length,
          rdvSemaine: semaine,
          rdvPlanifies: planifies,
        }));

        this.rdvAujourdhui.set(
          aujourdhui.sort((a, b) => a.debut.localeCompare(b.debut)),
        );
        this.loading.set(false);
      },
    });

    // Patients
    this.http.get<any[]>(`${api}/patients`).subscribe({
      next: (p) =>
        this.stats.update((s) => ({ ...s, totalPatients: p.length })),
    });

    // Factures impayées
    this.http.get<any[]>(`${api}/invoices/impayees`).subscribe({
      next: (inv) => {
        const montant = inv.reduce((sum, i) => sum + i.montantRestant, 0);
        this.stats.update((s) => ({
          ...s,
          facturesImpayees: inv.length,
          montantImpaye: montant,
        }));
        this.impayees.set(inv.slice(0, 5));
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLANIFIE':
        return 'badge-info';
      case 'CONFIRME':
        return 'badge-success';
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
      default:
        return status;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  }
}
