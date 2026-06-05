import { Routes } from '@angular/router';

export const billingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./invoice-list/invoice-list.component').then(
        (m) => m.InvoiceListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./invoice-detail/invoice-detail.component').then(
        (m) => m.InvoiceDetailComponent,
      ),
  },
];
