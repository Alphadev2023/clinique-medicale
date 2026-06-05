import { Routes } from '@angular/router';

export const messagingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./chat/chat.component').then((m) => m.ChatComponent),
  },
];
