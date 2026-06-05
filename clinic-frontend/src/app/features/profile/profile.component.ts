import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { environment } from '../../../environments/environment';
import {
  LucideAngularModule,
  User,
  Mail,
  Shield,
  Key,
  Save,
  Eye,
  EyeOff,
  Edit,
} from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  readonly User = User;
  readonly Mail = Mail;
  readonly Shield = Shield;
  readonly Key = Key;
  readonly Save = Save;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Edit = Edit;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  loading = signal(false);
  loadingPass = signal(false);
  editMode = signal(false);
  showOldPass = signal(false);
  showNewPass = signal(false);
  showConfPass = signal(false);
  userInfo = signal<any>(null);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: [{ value: '', disabled: true }],
    });

    this.passwordForm = this.fb.group(
      {
        ancienMotDePasse: ['', [Validators.required, Validators.minLength(6)]],
        nouveauMotDePasse: ['', [Validators.required, Validators.minLength(6)]],
        confirmerMotDePasse: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );

    this.loadProfile();
  }

  loadProfile() {
    this.http.get<any>(`${environment.apiUrl}/users/me`).subscribe({
      next: (user) => {
        this.userInfo.set(user);
        this.profileForm.patchValue({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
        });
      },
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const nouveau = form.get('nouveauMotDePasse')?.value;
    const confirmer = form.get('confirmerMotDePasse')?.value;
    return nouveau === confirmer ? null : { mismatch: true };
  }

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.loading.set(true);

    this.http
      .put<any>(`${environment.apiUrl}/users/me`, {
        nom: this.profileForm.get('nom')?.value,
        prenom: this.profileForm.get('prenom')?.value,
      })
      .subscribe({
        next: (user) => {
          this.loading.set(false);
          this.editMode.set(false);
          this.userInfo.set(user);
          this.toastService.success('Profil mis à jour avec succès');
        },
        error: () => {
          this.loading.set(false);
          this.toastService.error('Erreur lors de la mise à jour');
        },
      });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    this.loadingPass.set(true);

    const { ancienMotDePasse, nouveauMotDePasse } = this.passwordForm.value;

    this.http
      .put<void>(`${environment.apiUrl}/users/me/password`, {
        ancienMotDePasse,
        nouveauMotDePasse,
      })
      .subscribe({
        next: () => {
          this.loadingPass.set(false);
          this.passwordForm.reset();
          this.toastService.success('Mot de passe modifié avec succès');
        },
        error: () => {
          this.loadingPass.set(false);
          this.toastService.error('Ancien mot de passe incorrect');
        },
      });
  }

  getRoleColor(): string {
    switch (this.authService.userRole()) {
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700';
      case 'MEDECIN':
        return 'bg-green-100 text-green-700';
      case 'SECRETAIRE':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getInitials(): string {
    const user = this.userInfo();
    if (!user) return '?';
    return `${user.prenom?.charAt(0)}${user.nom?.charAt(0)}`.toUpperCase();
  }

  toggleEditMode() {
    this.editMode.set(!this.editMode());
  }
  toggleOldPass() {
    this.showOldPass.set(!this.showOldPass());
  }
  toggleNewPass() {
    this.showNewPass.set(!this.showNewPass());
  }
  toggleConfPass() {
    this.showConfPass.set(!this.showConfPass());
  }
}
