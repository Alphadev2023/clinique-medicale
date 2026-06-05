import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../services/prescription.service';
import { PatientService } from '../../patients/services/patient.service';
import { UserService } from '../../../core/services/user.service';
import { Prescription } from '../models/prescription.model';
import { Patient } from '../../patients/models/patient.model';
import { PrescriptionFormComponent } from '../prescription-form/prescription-form.component';
import { fadeInUp, listAnimation } from '../../../shared/animations/animations';
import {
  LucideAngularModule,
  FileText,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  X,
  FileDown,
  LucideIconData,
} from 'lucide-angular';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    PrescriptionFormComponent,
  ],
  animations: [fadeInUp, listAnimation],
  templateUrl: './prescription-list.component.html',
})
export class PrescriptionListComponent implements OnInit {
  readonly FileText = FileText;
  readonly Plus = Plus;
  readonly Search = Search;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Clock = Clock;
  readonly X = X;
  readonly FileDown = FileDown;

  prescriptions = signal<Prescription[]>([]);
  patients = signal<Patient[]>([]);
  loading = signal(true);
  showForm = signal(false);
  filterPatient = signal('');

  constructor(
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loadAll();
    this.patientService.lister().subscribe({
      next: (p) => this.patients.set(p),
    });
  }

  loadAll() {
    this.loading.set(true);
    const requests: Prescription[] = [];

    this.patientService.lister().subscribe({
      next: (patients) => {
        if (patients.length === 0) {
          this.loading.set(false);
          return;
        }
        let loaded = 0;
        patients.forEach((p) => {
          this.prescriptionService.parPatient(p.id).subscribe({
            next: (prescriptions) => {
              requests.push(...prescriptions);
              loaded++;
              if (loaded === patients.length) {
                this.prescriptions.set(
                  requests.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  ),
                );
                this.loading.set(false);
              }
            },
            error: () => {
              loaded++;
              if (loaded === patients.length) {
                this.prescriptions.set(requests);
                this.loading.set(false);
              }
            },
          });
        });
      },
    });
  }

  get filtered(): Prescription[] {
    if (!this.filterPatient()) return this.prescriptions();
    return this.prescriptions().filter(
      (p) => p.patientId === this.filterPatient(),
    );
  }

  onSaved() {
    this.showForm.set(false);
    this.loadAll();
  }

  annuler(id: string) {
    if (confirm('Annuler cette prescription ?')) {
      this.prescriptionService.annuler(id).subscribe({
        next: () => this.loadAll(),
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'badge-success';
      case 'EXPIREE':
        return 'badge-warning';
      case 'ANNULEE':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }

  getPatientName(patientId: string): string {
    const p = this.patients().find((p) => p.id === patientId);
    return p ? `${p.prenom} ${p.nom}` : patientId.substring(0, 8) + '...';
  }

  downloadPdf(id: string) {
    this.prescriptionService.downloadPdf(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `prescription_${id.substring(0, 8)}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastService.success('PDF téléchargé avec succès');
      },
      error: () => this.toastService.error('Erreur lors du téléchargement'),
    });
  }
}
