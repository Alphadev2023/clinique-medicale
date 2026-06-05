import { Component, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { InvoiceService } from '../services/invoice.service';
import { PatientService } from '../../patients/services/patient.service';
import { Patient } from '../../patients/models/patient.model';
import { LucideAngularModule, X, Plus, Trash2, Save } from 'lucide-angular';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './invoice-form.component.html',
})
export class InvoiceFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  readonly X = X;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Save = Save;

  form!: FormGroup;
  loading = signal(false);
  error = signal('');
  patients = signal<Patient[]>([]);

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private patientService: PatientService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      appointmentId: [''],
      prescriptionId: [''],
      dateFacture: ['', Validators.required],
      dateEcheance: [''],
      notes: [''],
      lignes: this.fb.array([this.createLigne()]),
    });

    this.patientService.lister().subscribe({
      next: (p) => this.patients.set(p),
    });
  }

  get lignesArray(): FormArray {
    return this.form.get('lignes') as FormArray;
  }

  createLigne() {
    return this.fb.group({
      description: ['', Validators.required],
      quantite: [1, Validators.required],
      prixUnitaire: [0, Validators.required],
    });
  }

  addLigne() {
    this.lignesArray.push(this.createLigne());
  }
  removeLigne(i: number) {
    this.lignesArray.removeAt(i);
  }

  getTotal(): number {
    return this.lignesArray.controls.reduce((sum, ctrl) => {
      return (
        sum + ctrl.get('quantite')!.value * ctrl.get('prixUnitaire')!.value
      );
    }, 0);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);

    const val = this.form.value;
    const req = {
      ...val,
      appointmentId: val.appointmentId || null,
      prescriptionId: val.prescriptionId || null,
    };

    this.invoiceService.creer(req).subscribe({
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
