import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  LucideAngularModule,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
} from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly LogIn = LogIn;

  form: FormGroup;
  loading = signal(false);
  error = signal('');
  showPass = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword() {
    this.showPass.update((v) => !v);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        switch (res.role) {
          case 'ADMIN':
            this.router.navigate(['/dashboard']);
            break;
          case 'MEDECIN':
            this.router.navigate(['/dashboard/medecin']);
            break;
          case 'SECRETAIRE':
            this.router.navigate(['/dashboard/secretaire']);
            break;
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Email ou mot de passe incorrect');
      },
    });
  }

  get emailCtrl() {
    return this.form.get('email')!;
  }
  get passwordCtrl() {
    return this.form.get('password')!;
  }
}
