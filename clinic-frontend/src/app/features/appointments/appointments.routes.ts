import { Routes } from '@angular/router';

export const appointmentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./appointment-list/appointment-list.component').then(
        (m) => m.AppointmentListComponent,
      ),
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./appointment-calendar/appointment-calendar.component').then(
        (m) => m.AppointmentCalendarComponent,
      ),
  },
];
