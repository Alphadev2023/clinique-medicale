import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as Role[];

  if (!roles || authService.hasAnyRole(roles)) {
    return true;
  }

  // Redirige vers le bon dashboard selon le rôle
  const role = authService.userRole();
  switch (role) {
    case 'MEDECIN':
      router.navigate(['/dashboard/medecin']);
      break;
    case 'SECRETAIRE':
      router.navigate(['/dashboard/secretaire']);
      break;
    default:
      router.navigate(['/dashboard']);
      break;
  }
  return false;
};
