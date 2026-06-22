// src/routes/RoleRoute.tsx

import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../application/auth/useAuth";
import type { Role } from "../domain/user";

interface RoleRouteProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const user = useAuth((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
