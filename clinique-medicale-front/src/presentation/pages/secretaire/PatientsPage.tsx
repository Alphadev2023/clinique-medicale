// src/presentation/pages/secretaire/PatientsPage.tsx

import { PatientsManager } from "../../components/PatientsManager";

export default function PatientsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Patients</h1>
      <PatientsManager />
    </div>
  );
}
