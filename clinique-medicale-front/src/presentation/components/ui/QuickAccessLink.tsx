// src/presentation/components/ui/QuickAccessLink.tsx

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface QuickAccessLinkProps {
  to: string;
  label: string;
  description?: string;
  icon: ReactNode;
  className?: string;
}

export const QuickAccessLink = forwardRef<
  HTMLAnchorElement,
  QuickAccessLinkProps
>(({ to, label, description, icon, className = "" }, ref) => {
  return (
    <Link
      ref={ref}
      to={to}
      className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-primary-600 hover:bg-primary-50 ${className}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </Link>
  );
});

QuickAccessLink.displayName = "QuickAccessLink";
