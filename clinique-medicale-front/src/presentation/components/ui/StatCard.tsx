// src/presentation/components/ui/StatCard.tsx

import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  subtitle?: string;
  subtitleVariant?: "success" | "warning" | "danger" | "neutral";
}

const ICON_BG_CLASSES: Record<NonNullable<StatCardProps["variant"]>, string> = {
  primary: "bg-primary-50 text-primary-600",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
  neutral: "bg-gray-100 text-gray-600",
};

const SUBTITLE_CLASSES: Record<
  NonNullable<StatCardProps["subtitleVariant"]>,
  string
> = {
  success: "text-success-600",
  warning: "text-warning-600",
  danger: "text-danger-600",
  neutral: "text-gray-500",
};

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      icon,
      variant = "primary",
      subtitle,
      subtitleVariant = "neutral",
      className = "",
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
        {...rest}
      >
        {icon && (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-md ${ICON_BG_CLASSES[variant]}`}
          >
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className={`text-xs ${SUBTITLE_CLASSES[subtitleVariant]}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  },
);

StatCard.displayName = "StatCard";
