// src/presentation/pages/medecin/MesPatientsPage.tsx
import { MesPatientsManager } from "../../components/MesPatientsManager";

export default function MesPatientsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Mes patients
      </h1>
      <MesPatientsManager />
    </div>
  );
}
