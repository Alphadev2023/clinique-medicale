// src/presentation/components/charts/AppointmentStatusChart.tsx

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { compterParStatut } from "../../../domain/appointment";
import type {
  Appointment,
  AppointmentStatus,
} from "../../../domain/appointment";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AppointmentStatusChartProps {
  appointments: Appointment[];
}

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  PLANIFIE: "#2563eb",
  CONFIRME: "#16a34a",
  TERMINE: "#9ca3af",
  ANNULE: "#dc2626",
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PLANIFIE: "Planifiés",
  CONFIRME: "Confirmés",
  TERMINE: "Terminés",
  ANNULE: "Annulés",
};

export function AppointmentStatusChart({
  appointments,
}: AppointmentStatusChartProps) {
  const repartition = compterParStatut(appointments);
  const statuts = Object.keys(repartition) as AppointmentStatus[];
  const total = statuts.reduce((sum, s) => sum + repartition[s], 0);

  if (total === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        Aucun rendez-vous à afficher
      </p>
    );
  }

  const data = {
    labels: statuts.map((s) => STATUS_LABELS[s]),
    datasets: [
      {
        data: statuts.map((s) => repartition[s]),
        backgroundColor: statuts.map((s) => STATUS_COLORS[s]),
        borderWidth: 0,
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      options={{ plugins: { legend: { position: "bottom" as const } } }}
    />
  );
}
