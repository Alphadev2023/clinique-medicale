// src/presentation/components/ui/Badge.tsx

import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

type BadgeVariant = "primary" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: "bg-primary-50 text-primary-700",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-700",
  neutral: "bg-gray-100 text-gray-700",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "neutral", className = "", children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANT_CLASSES[variant]} ${className}`}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
