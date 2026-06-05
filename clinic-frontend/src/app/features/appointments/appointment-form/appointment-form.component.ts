import { Component, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { PatientService } from '../../patients/services/patient.service';
import { UserService, UserSummary } from '../../../core/services/user.service';
import { Patient } from '../../patients/models/patient.model';
import { LucideAngularModule, X, Save } from 'lucide-angular';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './appointment-form.component.html',
})
export class AppointmentFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  readonly X = X;
  readonly Save = Save;

  form!: FormGroup;
  loading = signal(false);
  error = signal('');
  patients = signal<Patient[]>([]);
  medecins = signal<UserSummary[]>([]);

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      medecinId: ['', Validators.required],
      debut: ['', Validators.required],
      fin: ['', Validators.required],
      motif: [''],
      salle: [''],
      notes: [''],
    });

    this.patientService.lister().subscribe({
      next: (p) => this.patients.set(p),
    });

    this.userService.getMedecins().subscribe({
      next: (m) => this.medecins.set(m),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const val = this.form.value;
    const req = {
      ...val,
      debut: new Date(val.debut).toISOString().slice(0, 19),
      fin: new Date(val.fin).toISOString().slice(0, 19),
    };

    this.appointmentService.creer(req).subscribe({
      next: () => {
        this.loading.set(false);
        this.saved.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de la création');
      },
    });
  }
}
