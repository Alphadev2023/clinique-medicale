import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const statsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./stats.component').then((m) => m.StatsComponent),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] },
  },
];
