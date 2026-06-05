import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';
import {
  LucideAngularModule,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Shield,
  FileText,
  AlertTriangle,
} from 'lucide-angular';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './patient-detail.component.html',
})
export class PatientDetailComponent implements OnInit {
  readonly ArrowLeft = ArrowLeft;
  readonly User = User;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly Shield = Shield;
  readonly FileText = FileText;
  readonly AlertTriangle = AlertTriangle;

  patient = signal<Patient | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.patientService.getById(id).subscribe({
      next: (p) => {
        this.patient.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
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

  getSeveriteClass(severite: string): string {
    switch (severite) {
      case 'SÉVÈRE':
        return 'badge-danger';
      case 'MODÉRÉE':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  }
}
