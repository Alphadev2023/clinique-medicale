// src/presentation/components/charts/PatientsByGenderChart.tsx

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { compterParGenre } from "../../../domain/patient";
import type { Patient } from "../../../domain/patient";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PatientsByGenderChartProps {
  patients: Patient[];
}

export function PatientsByGenderChart({
  patients,
}: PatientsByGenderChartProps) {
  const repartition = compterParGenre(patients);

  if (patients.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        Aucun patient à afficher
      </p>
    );
  }

  const data = {
    labels: ["Masculin", "Féminin", "Autre", "Non précisé"],
    datasets: [
      {
        data: [
          repartition.MASCULIN,
          repartition.FEMININ,
          repartition.AUTRE,
          repartition.NON_PRECISE,
        ],
        backgroundColor: ["#2563eb", "#ec4899", "#9333ea", "#9ca3af"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Pie
      data={data}
      options={{ plugins: { legend: { position: "bottom" as const } } }}
    />
  );
}
