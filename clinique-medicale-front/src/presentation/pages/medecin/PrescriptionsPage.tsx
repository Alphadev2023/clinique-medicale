// src/presentation/pages/medecin/PrescriptionsPage.tsx
import { PrescriptionsManager } from "../../components/PrescriptionsManager";

export default function PrescriptionsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Prescriptions
      </h1>
      <PrescriptionsManager />
    </div>
  );
}
