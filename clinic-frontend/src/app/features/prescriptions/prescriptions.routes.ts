import { Routes } from '@angular/router';

export const prescriptionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./prescription-list/prescription-list.component').then(
        (m) => m.PrescriptionListComponent,
      ),
  },
];
