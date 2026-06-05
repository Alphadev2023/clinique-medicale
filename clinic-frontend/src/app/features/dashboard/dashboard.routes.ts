import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'medecin',
    loadComponent: () =>
      import('./medecin-dashboard/medecin-dashboard.component').then(
        (m) => m.MedecinDashboardComponent,
      ),
    canActivate: [roleGuard],
    data: { roles: ['MEDECIN'] },
  },
  {
    path: 'secretaire',
    loadComponent: () =>
      import('./secretaire-dashboard/secretaire-dashboard.component').then(
        (m) => m.SecretaireDashboardComponent,
      ),
    canActivate: [roleGuard],
    data: { roles: ['SECRETAIRE'] },
  },
];
