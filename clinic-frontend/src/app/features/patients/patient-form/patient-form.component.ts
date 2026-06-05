import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';
import {
  LucideAngularModule,
  X,
  Plus,
  Trash2,
  Save,
  AlertCircle,
} from 'lucide-angular';
import {
  scaleIn,
  overlayAnimation,
} from '../../../shared/animations/animations';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    FormFieldComponent,
  ],
  animations: [overlayAnimation, scaleIn],
  templateUrl: './patient-form.component.html',
})
export class PatientFormComponent implements OnInit {
  @Input() patient: Patient | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  readonly X = X;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Save = Save;
  readonly AlertCircle = AlertCircle;

  form!: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nom: [this.patient?.nom || '', Validators.required],
      prenom: [this.patient?.prenom || '', Validators.required],
      email: [
        this.patient?.email || '',
        [Validators.required, Validators.email],
      ],
      telephone: [this.patient?.telephone || ''],
      dateNaissance: [this.patient?.dateNaissance || '', Validators.required],
      genre: [this.patient?.genre || 'MASCULIN'],
      adresse: [this.patient?.adresse || ''],
      numeroSecuriteSociale: [this.patient?.numeroSecuriteSociale || ''],
      historiqueMedical: this.fb.group({
        antecedents: [this.patient?.historiqueMedical?.antecedents || ''],
        maladiesChroniques: [
          this.patient?.historiqueMedical?.maladiesChroniques || '',
        ],
        chirurgies: [this.patient?.historiqueMedical?.chirurgies || ''],
        traitementsEnCours: [
          this.patient?.historiqueMedical?.traitementsEnCours || '',
        ],
      }),
      allergies: this.fb.array(
        (this.patient?.allergies || []).map((a) => this.createAllergyGroup(a)),
      ),
    });
  }

  get allergiesArray(): FormArray {
    return this.form.get('allergies') as FormArray;
  }

  createAllergyGroup(allergy?: any) {
    return this.fb.group({
      nom: [allergy?.nom || ''],
      severite: [allergy?.severite || 'LÉGÈRE'],
      reaction: [allergy?.reaction || ''],
    });
  }

  addAllergy() {
    this.allergiesArray.push(this.createAllergyGroup());
  }

  removeAllergy(index: number) {
    this.allergiesArray.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const req = this.form.value;

    const obs = this.patient
      ? this.patientService.modifier(this.patient.id, req)
      : this.patientService.creer(req);

    obs.subscribe({
      next: () => {
        this.loading.set(false);
        this.saved.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Une erreur est survenue');
      },
    });
  }
}
