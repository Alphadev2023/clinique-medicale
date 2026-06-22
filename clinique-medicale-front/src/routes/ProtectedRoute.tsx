// src/routes/ProtectedRoute.tsx

import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../application/auth/useAuth";
import { Spinner } from "../presentation/components/ui/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuth((state) => state.user);
  const isInitializing = useAuth((state) => state.isInitializing);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
