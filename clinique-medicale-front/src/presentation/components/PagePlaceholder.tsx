// src/presentation/components/PagePlaceholder.tsx

import { Construction } from "lucide-react";

interface PagePlaceholderProps {
  title: string;
  description?: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">{title}</h1>
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
        <Construction className="h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-500">
          {description ?? "Cette page sera construite prochainement."}
        </p>
      </div>
    </div>
  );
}
