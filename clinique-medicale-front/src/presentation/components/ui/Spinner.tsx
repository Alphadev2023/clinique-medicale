// src/presentation/components/ui/Spinner.tsx

import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className = "" }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        size={size}
        className={`animate-spin text-primary-600 ${className}`}
      />
    </div>
  );
}
