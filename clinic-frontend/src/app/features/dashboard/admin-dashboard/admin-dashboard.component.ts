import {
  Component,
  OnInit,
  signal,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Chart, registerables } from 'chart.js';
import { fadeInUp, countUp } from '../../../shared/animations/animations';
import {
  LucideAngularModule,
  Users,
  Calendar,
  Receipt,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  UserPlus,
  CalendarPlus,
} from 'lucide-angular';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  animations: [fadeInUp, countUp],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('donutChart') donutCanvas!: ElementRef;
  @ViewChild('barChart') barCanvas!: ElementRef;
  @ViewChild('lineChart') lineCanvas!: ElementRef;
  @ViewChild('pieChart') pieCanvas!: ElementRef;

  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly Receipt = Receipt;
  readonly TrendingUp = TrendingUp;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly ArrowRight = ArrowRight;
  readonly UserPlus = UserPlus;
  readonly CalendarPlus = CalendarPlus;

  stats = signal({
    totalPatients: 0,
    totalRdv: 0,
    rdvAujourdhui: 0,
    revenus: 0,
    facturesImpayees: 0,
    rdvPlanifies: 0,
    rdvTermines: 0,
    rdvAnnules: 0,
  });

  recentAppointments = signal<any[]>([]);
  loading = signal(true);
  chartsReady = signal(false);

  private donutChart!: Chart;
  private barChart!: Chart;
  private lineChart!: Chart;
  private pieChart!: Chart;

  private rdvData = [0, 0, 0, 0];
  private rdvMois = new Array(12).fill(0);
  private revenusMois = new Array(12).fill(0);
  private genreData = [0, 0, 0];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initCharts(), 500);
  }

  initCharts() {
    if (!this.donutCanvas) return;

    // Donut — statuts RDV
    this.donutChart = new Chart(this.donutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Planifiés', 'Confirmés', 'Terminés', 'Annulés'],
        datasets: [
          {
            data: this.rdvData,
            backgroundColor: ['#3b82f6', '#10b981', '#6b7280', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Répartition des RDV' },
        },
      },
    });

    // Bar — RDV par mois
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Jan',
          'Fév',
          'Mar',
          'Avr',
          'Mai',
          'Jun',
          'Jul',
          'Aoû',
          'Sep',
          'Oct',
          'Nov',
          'Déc',
        ],
        datasets: [
          {
            label: 'Rendez-vous',
            data: this.rdvMois,
            backgroundColor: 'rgba(37, 99, 235, 0.8)',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'RDV par mois' },
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
          x: { grid: { display: false } },
        },
      },
    });

    // Line — revenus
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Fév',
          'Mar',
          'Avr',
          'Mai',
          'Jun',
          'Jul',
          'Aoû',
          'Sep',
          'Oct',
          'Nov',
          'Déc',
        ],
        datasets: [
          {
            label: 'Revenus (FCFA)',
            data: this.revenusMois,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Revenus mensuels' },
        },
        scales: {
          y: { beginAtZero: true },
          x: { grid: { display: false } },
        },
      },
    });

    // Pie — genres
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Masculin', 'Féminin', 'Autre'],
        datasets: [
          {
            data: this.genreData,
            backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6'],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Patients par genre' },
        },
      },
    });

    this.chartsReady.set(true);
  }

  updateCharts() {
    if (!this.chartsReady()) return;

    this.donutChart.data.datasets[0].data = this.rdvData;
    this.donutChart.update();

    this.barChart.data.datasets[0].data = this.rdvMois;
    this.barChart.update();

    this.lineChart.data.datasets[0].data = this.revenusMois;
    this.lineChart.update();

    this.pieChart.data.datasets[0].data = this.genreData;
    this.pieChart.update();
  }

  loadStats() {
    const api = environment.apiUrl;

    this.http.get<any[]>(`${api}/patients`).subscribe({
      next: (patients) => {
        this.stats.update((s) => ({ ...s, totalPatients: patients.length }));
        this.genreData = [
          patients.filter((p) => p.genre === 'MASCULIN').length,
          patients.filter((p) => p.genre === 'FEMININ').length,
          patients.filter((p) => p.genre === 'AUTRE').length,
        ];
        this.updateCharts();
      },
    });

    this.http.get<any[]>(`${api}/appointments`).subscribe({
      next: (appointments) => {
        const today = new Date().toISOString().split('T')[0];
        const rdvAujourdhui = appointments.filter((a) =>
          a.debut.startsWith(today),
        ).length;
        const rdvPlanifies = appointments.filter(
          (a) => a.status === 'PLANIFIE' || a.status === 'CONFIRME',
        ).length;
        const rdvConfirmes = appointments.filter(
          (a) => a.status === 'CONFIRME',
        ).length;
        const rdvTermines = appointments.filter(
          (a) => a.status === 'TERMINE',
        ).length;
        const rdvAnnules = appointments.filter(
          (a) => a.status === 'ANNULE',
        ).length;

        this.stats.update((s) => ({
          ...s,
          totalRdv: appointments.length,
          rdvAujourdhui,
          rdvPlanifies,
          rdvTermines,
          rdvAnnules,
        }));

        this.rdvData = [rdvPlanifies, rdvConfirmes, rdvTermines, rdvAnnules];

        this.rdvMois = new Array(12).fill(0);
        appointments.forEach((a) => {
          const mois = new Date(a.debut).getMonth();
          this.rdvMois[mois]++;
        });

        this.recentAppointments.set(appointments.slice(-5).reverse());
        this.loading.set(false);
        this.updateCharts();
      },
    });

    this.http.get<number>(`${api}/invoices/stats/revenus`).subscribe({
      next: (revenus) => this.stats.update((s) => ({ ...s, revenus })),
    });

    this.http.get<any[]>(`${api}/invoices/impayees`).subscribe({
      next: (impayees) => {
        this.stats.update((s) => ({ ...s, facturesImpayees: impayees.length }));
      },
    });

    this.http.get<any[]>(`${api}/invoices`).subscribe({
      next: (invoices) => {
        this.revenusMois = new Array(12).fill(0);
        invoices.forEach((inv) => {
          if (inv.status !== 'ANNULEE') {
            const mois = new Date(inv.dateFacture).getMonth();
            this.revenusMois[mois] += inv.montantPaye || 0;
          }
        });
        this.updateCharts();
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
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  }
}
