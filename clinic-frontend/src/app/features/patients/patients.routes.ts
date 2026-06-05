import { Routes } from '@angular/router';

export const patientsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./patient-list/patient-list.component').then(
        (m) => m.PatientListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./patient-detail/patient-detail.component').then(
        (m) => m.PatientDetailComponent,
      ),
  },
];
