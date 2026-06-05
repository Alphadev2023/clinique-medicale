import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Role,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'clinic_token';
  private readonly USER_KEY = 'clinic_user';

  // Signals Angular 17
  private _currentUser = signal<AuthResponse | null>(this.loadUser());
  currentUser = this._currentUser.asReadonly();
  isLoggedIn = computed(() => this._currentUser() !== null);
  userRole = computed(() => this._currentUser()?.role ?? null);
  userName = computed(() => this._currentUser()?.nom ?? '');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(req: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, req)
      .pipe(tap((res) => this.saveSession(res)));
  }

  register(req: RegisterRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, req)
      .pipe(tap((res) => this.saveSession(res)));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: Role): boolean {
    return this._currentUser()?.role === role;
  }

  hasAnyRole(roles: Role[]): boolean {
    const userRole = this._currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    this._currentUser.set(res);
  }

  private loadUser(): AuthResponse | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
