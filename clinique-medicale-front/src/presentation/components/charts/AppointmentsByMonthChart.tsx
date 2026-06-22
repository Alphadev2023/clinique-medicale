// src/presentation/components/charts/AppointmentsByMonthChart.tsx

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { compterParMois } from "../../../domain/appointment";
import type { Appointment } from "../../../domain/appointment";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface AppointmentsByMonthChartProps {
  appointments: Appointment[];
}

export function AppointmentsByMonthChart({
  appointments,
}: AppointmentsByMonthChartProps) {
  const repartition = compterParMois(appointments, 6);

  const data = {
    labels: repartition.map((r) => r.mois),
    datasets: [
      {
        label: "Rendez-vous",
        data: repartition.map((r) => r.count),
        backgroundColor: "#2563eb",
        borderRadius: 4,
      },
    ],
  };

  return (
    <Bar
      data={data}
      options={{
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      }}
    />
  );
}
