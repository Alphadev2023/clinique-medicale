import {
  Component,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Chart, registerables } from 'chart.js';
import {
  LucideAngularModule,
  TrendingUp,
  Users,
  Calendar,
  Receipt,
  Activity,
  Award,
  Target,
  BarChart2,
} from 'lucide-angular';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './stats.component.html',
})
export class StatsComponent implements OnInit, AfterViewInit {
  @ViewChild('rdvParMoisChart') rdvParMoisCanvas!: ElementRef;
  @ViewChild('rdvParMedecinChart') rdvParMedecinCanvas!: ElementRef;
  @ViewChild('revenusChart') revenusCanvas!: ElementRef;
  @ViewChild('patientAgeChart') patientAgeCanvas!: ElementRef;

  readonly TrendingUp = TrendingUp;
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly Receipt = Receipt;
  readonly Activity = Activity;
  readonly Award = Award;
  readonly Target = Target;
  readonly BarChart2 = BarChart2;

  loading = signal(true);

  kpis = signal({
    totalPatients: 0,
    totalRdv: 0,
    totalRevenus: 0,
    totalPrescriptions: 0,
    tauxConfirmation: 0,
    tauxAnnulation: 0,
    revenuMoyen: 0,
    rdvParJour: 0,
  });

  topMedecins = signal<any[]>([]);
  recentStats = signal<any[]>([]);

  private rdvParMoisChart!: Chart;
  private rdvParMedecinChart!: Chart;
  private revenusChart!: Chart;
  private patientAgeChart!: Chart;

  private rdvMoisData = new Array(12).fill(0);
  private medecinLabels: string[] = [];
  private medecinData: number[] = [];
  private revenusData = new Array(12).fill(0);
  private ageData = [0, 0, 0, 0, 0];
  private chartsReady = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAllStats();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCharts();
      this.chartsReady = true;
      this.updateCharts();
    }, 600);
  }

  initCharts() {
    // RDV par mois
    this.rdvParMoisChart = new Chart(this.rdvParMoisCanvas.nativeElement, {
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
            data: this.rdvMoisData,
            backgroundColor: 'rgba(37, 99, 235, 0.8)',
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Rendez-vous par mois',
            font: { size: 14, weight: 'bold' },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: '#f3f4f6' },
          },
          x: { grid: { display: false } },
        },
      },
    });

    // RDV par médecin
    this.rdvParMedecinChart = new Chart(
      this.rdvParMedecinCanvas.nativeElement,
      {
        type: 'horizontalBar' as any,
        data: {
          labels: this.medecinLabels,
          datasets: [
            {
              label: 'RDV',
              data: this.medecinData,
              backgroundColor: [
                'rgba(37, 99, 235, 0.8)',
                'rgba(5, 150, 105, 0.8)',
                'rgba(124, 58, 237, 0.8)',
                'rgba(217, 119, 6, 0.8)',
                'rgba(220, 38, 38, 0.8)',
              ],
              borderRadius: 6,
            },
          ],
        },
        options: {
          indexAxis: 'y' as any,
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'RDV par médecin',
              font: { size: 14, weight: 'bold' },
            },
          },
          scales: {
            x: { beginAtZero: true, grid: { color: '#f3f4f6' } },
            y: { grid: { display: false } },
          },
        },
      },
    );

    // Revenus par mois
    this.revenusChart = new Chart(this.revenusCanvas.nativeElement, {
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
            data: this.revenusData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Revenus mensuels (FCFA)',
            font: { size: 14, weight: 'bold' },
          },
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
          x: { grid: { display: false } },
        },
      },
    });

    // Patients par tranche d'âge
    this.patientAgeChart = new Chart(this.patientAgeCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['0-18', '19-35', '36-50', '51-65', '65+'],
        datasets: [
          {
            data: this.ageData,
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#8b5cf6',
              '#ef4444',
            ],
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 15, font: { size: 11 } },
          },
          title: {
            display: true,
            text: "Patients par tranche d'âge",
            font: { size: 14, weight: 'bold' },
          },
        },
      },
    });
  }

  updateCharts() {
    if (!this.chartsReady) return;

    this.rdvParMoisChart.data.datasets[0].data = this.rdvMoisData;
    this.rdvParMoisChart.update();

    this.rdvParMedecinChart.data.labels = this.medecinLabels;
    this.rdvParMedecinChart.data.datasets[0].data = this.medecinData;
    this.rdvParMedecinChart.update();

    this.revenusChart.data.datasets[0].data = this.revenusData;
    this.revenusChart.update();

    this.patientAgeChart.data.datasets[0].data = this.ageData;
    this.patientAgeChart.update();
  }

  loadAllStats() {
    const api = environment.apiUrl;

    // Patients
    this.http.get<any[]>(`${api}/patients`).subscribe({
      next: (patients) => {
        this.kpis.update((k) => ({ ...k, totalPatients: patients.length }));

        // Tranches d'âge
        const ages = [0, 0, 0, 0, 0];
        patients.forEach((p) => {
          const age = this.getAge(p.dateNaissance);
          if (age <= 18) ages[0]++;
          else if (age <= 35) ages[1]++;
          else if (age <= 50) ages[2]++;
          else if (age <= 65) ages[3]++;
          else ages[4]++;
        });
        this.ageData = ages;
        this.updateCharts();
      },
    });

    // Appointments
    this.http.get<any[]>(`${api}/appointments`).subscribe({
      next: (rdvs) => {
        this.kpis.update((k) => ({ ...k, totalRdv: rdvs.length }));

        const confirmes = rdvs.filter(
          (r) => r.status === 'CONFIRME' || r.status === 'TERMINE',
        ).length;
        const annules = rdvs.filter((r) => r.status === 'ANNULE').length;
        const tauxConf =
          rdvs.length > 0 ? Math.round((confirmes / rdvs.length) * 100) : 0;
        const tauxAnn =
          rdvs.length > 0 ? Math.round((annules / rdvs.length) * 100) : 0;
        const rdvParJour =
          rdvs.length > 0 ? parseFloat((rdvs.length / 30).toFixed(1)) : 0;

        this.kpis.update((k) => ({
          ...k,
          tauxConfirmation: tauxConf,
          tauxAnnulation: tauxAnn,
          rdvParJour,
        }));

        // RDV par mois
        const mois = new Array(12).fill(0);
        rdvs.forEach((r) => {
          const m = new Date(r.debut).getMonth();
          mois[m]++;
        });
        this.rdvMoisData = mois;

        // RDV par médecin
        const medecinMap = new Map<string, number>();
        rdvs.forEach((r) => {
          const count = medecinMap.get(r.medecinId) || 0;
          medecinMap.set(r.medecinId, count + 1);
        });

        // Enrichir avec noms médecins
        this.http.get<any[]>(`${api}/users/medecins`).subscribe({
          next: (medecins) => {
            const top: any[] = [];
            medecinMap.forEach((count, id) => {
              const m = medecins.find((m) => m.id === id);
              if (m) top.push({ nom: `Dr. ${m.prenom} ${m.nom}`, count });
            });
            top.sort((a, b) => b.count - a.count);
            this.topMedecins.set(top.slice(0, 5));
            this.medecinLabels = top.slice(0, 5).map((t) => t.nom);
            this.medecinData = top.slice(0, 5).map((t) => t.count);
            this.updateCharts();
          },
        });

        this.updateCharts();
        this.loading.set(false);
      },
    });

    // Prescriptions
    this.http.get<any[]>(`${api}/patients`).subscribe({
      next: (patients) => {
        let total = 0;
        let loaded = 0;
        if (patients.length === 0) return;
        patients.forEach((p) => {
          this.http
            .get<any[]>(`${api}/prescriptions/patient/${p.id}`)
            .subscribe({
              next: (presc) => {
                total += presc.length;
                loaded++;
                if (loaded === patients.length) {
                  this.kpis.update((k) => ({
                    ...k,
                    totalPrescriptions: total,
                  }));
                }
              },
              error: () => {
                loaded++;
              },
            });
        });
      },
    });

    // Revenus
    this.http.get<any[]>(`${api}/invoices`).subscribe({
      next: (invoices) => {
        const totalRev = invoices
          .filter((i) => i.status !== 'ANNULEE')
          .reduce((sum, i) => sum + (i.montantPaye || 0), 0);

        const revMois = new Array(12).fill(0);
        invoices.forEach((inv) => {
          if (inv.status !== 'ANNULEE') {
            const m = new Date(inv.dateFacture).getMonth();
            revMois[m] += inv.montantPaye || 0;
          }
        });

        const revMoyen =
          invoices.length > 0 ? Math.round(totalRev / invoices.length) : 0;

        this.revenusData = revMois;
        this.kpis.update((k) => ({
          ...k,
          totalRevenus: totalRev,
          revenuMoyen: revMoyen,
        }));
        this.updateCharts();
      },
    });
  }

  getAge(dateNaissance: string): number {
    const today = new Date();
    const birth = new Date(dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  }
}
