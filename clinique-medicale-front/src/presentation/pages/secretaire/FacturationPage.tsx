// src/presentation/pages/secretaire/FacturationPage.tsx
import { BillingManager } from "../../components/BillingManager";

export default function FacturationPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Facturation</h1>
      <BillingManager />
    </div>
  );
}
