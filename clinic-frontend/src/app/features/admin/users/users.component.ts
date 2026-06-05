import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService, UserSummary } from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/services/toast.service';
import {
  LucideAngularModule,
  Users,
  UserPlus,
  Shield,
  Mail,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  Eye,
  EyeOff,
} from 'lucide-angular';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  readonly Users = Users;
  readonly UserPlus = UserPlus;
  readonly Shield = Shield;
  readonly Mail = Mail;
  readonly ToggleLeft = ToggleLeft;
  readonly ToggleRight = ToggleRight;
  readonly X = X;
  readonly Save = Save;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  allUsers = signal<UserSummary[]>([]);
  loading = signal(true);
  showForm = signal(false);
  showPass = signal(false);
  filterRole = signal('TOUS');

  form!: FormGroup;
  formLoading = signal(false);

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['MEDECIN', Validators.required],
    });
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (users) => {
        this.allUsers.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  get filtered(): UserSummary[] {
    if (this.filterRole() === 'TOUS') return this.allUsers();
    return this.allUsers().filter((u) => u.role === this.filterRole());
  }

  toggleActif(user: UserSummary) {
    this.userService.toggleActif(user.id).subscribe({
      next: () => {
        this.toastService.success(
          user.actif ? 'Compte désactivé' : 'Compte activé',
        );
        this.loadUsers();
      },
      error: () => this.toastService.error('Erreur lors de la modification'),
    });
  }

  creerUtilisateur() {
    if (this.form.invalid) return;
    this.formLoading.set(true);

    this.http
      .post(`${environment.apiUrl}/auth/register`, this.form.value)
      .subscribe({
        next: () => {
          this.formLoading.set(false);
          this.showForm.set(false);
          this.form.reset({ role: 'MEDECIN' });
          this.toastService.success('Utilisateur créé avec succès');
          this.loadUsers();
        },
        error: (err) => {
          this.formLoading.set(false);
          this.toastService.error(
            err.error?.message || 'Erreur lors de la création',
          );
        },
      });
  }

  getRoleClass(role: string): string {
    switch (role) {
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

  getInitials(nom: string, prenom: string): string {
    return `${prenom?.charAt(0)}${nom?.charAt(0)}`.toUpperCase();
  }

  countByRole(role: string): number {
    return this.allUsers().filter((u) => u.role === role).length;
  }

  toggleShowPass() {
    this.showPass.update((v) => !v);
  }
}
