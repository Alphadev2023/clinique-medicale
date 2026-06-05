import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null token when not logged in', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should login and save token', () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      role: 'ADMIN',
      nom: 'Dupont',
      id: 'user-123',
    };

    service
      .login({ email: 'admin@clinique.com', password: 'admin123' })
      .subscribe((res) => {
        expect(res.token).toBe('fake-jwt-token');
        expect(service.getToken()).toBe('fake-jwt-token');
        expect(service.isLoggedIn()).toBe(true);
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear storage', () => {
    localStorage.setItem('clinic_token', 'fake-token');
    localStorage.setItem(
      'clinic_user',
      JSON.stringify({
        token: 'fake-token',
        role: 'ADMIN',
        nom: 'Dupont',
        id: '1',
      }),
    );

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should check role correctly', () => {
    localStorage.setItem(
      'clinic_user',
      JSON.stringify({
        token: 'fake-token',
        role: 'ADMIN',
        nom: 'Dupont',
        id: '1',
      }),
    );
    service['_currentUser'].set({
      token: 'fake-token',
      role: 'ADMIN',
      nom: 'Dupont',
      id: '1',
    });

    expect(service.hasRole('ADMIN')).toBe(true);
    expect(service.hasRole('MEDECIN')).toBe(false);
    expect(service.hasAnyRole(['ADMIN', 'MEDECIN'])).toBe(true);
  });
});
