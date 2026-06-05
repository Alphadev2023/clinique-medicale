import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PatientService } from './patient.service';
import { environment } from '../../../../environments/environment';

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;

  const mockPatient = {
    id: 'patient-123',
    nom: 'Camara',
    prenom: 'Yaya',
    email: 'yaya@gmail.com',
    telephone: '621333649',
    dateNaissance: '2000-06-09',
    genre: 'MASCULIN',
    adresse: 'Yaoundé',
    allergies: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService],
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all patients', () => {
    service.lister().subscribe((patients) => {
      expect(patients.length).toBe(1);
      expect(patients[0].nom).toBe('Camara');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/patients`);
    expect(req.request.method).toBe('GET');
    req.flush([mockPatient]);
  });

  it('should fetch patient by id', () => {
    service.getById('patient-123').subscribe((patient) => {
      expect(patient.id).toBe('patient-123');
      expect(patient.email).toBe('yaya@gmail.com');
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/patients/patient-123`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPatient);
  });

  it('should create a patient', () => {
    service.creer(mockPatient as any).subscribe((patient) => {
      expect(patient.nom).toBe('Camara');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/patients`);
    expect(req.request.method).toBe('POST');
    req.flush(mockPatient);
  });

  it('should update a patient', () => {
    service.modifier('patient-123', mockPatient as any).subscribe((patient) => {
      expect(patient.nom).toBe('Camara');
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/patients/patient-123`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mockPatient);
  });

  it('should delete a patient', () => {
    service.supprimer('patient-123').subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/patients/patient-123`,
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should search patients', () => {
    service.rechercher('Yaya').subscribe((patients) => {
      expect(patients.length).toBe(1);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/patients/search?q=Yaya`,
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockPatient]);
  });
});
