import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: '500',
    loadComponent: () =>
      import('./features/error/server-error.component').then(
        (m) => m.ServerErrorComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then(
        (m) => m.LayoutComponent,
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes,
          ),
      },
      {
        path: 'patients',
        loadChildren: () =>
          import('./features/patients/patients.routes').then(
            (m) => m.patientsRoutes,
          ),
      },
      {
        path: 'appointments',
        loadChildren: () =>
          import('./features/appointments/appointments.routes').then(
            (m) => m.appointmentsRoutes,
          ),
      },
      {
        path: 'prescriptions',
        loadChildren: () =>
          import('./features/prescriptions/prescriptions.routes').then(
            (m) => m.prescriptionsRoutes,
          ),
      },
      {
        path: 'billing',
        loadChildren: () =>
          import('./features/billing/billing.routes').then(
            (m) => m.billingRoutes,
          ),
      },
      {
        path: 'messaging',
        loadChildren: () =>
          import('./features/messaging/messaging.routes').then(
            (m) => m.messagingRoutes,
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.routes').then(
            (m) => m.profileRoutes,
          ),
      },
      {
        path: 'stats',
        loadChildren: () =>
          import('./features/stats/stats.routes').then((m) => m.statsRoutes),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.routes').then((m) => m.adminRoutes),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/error/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/error/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
