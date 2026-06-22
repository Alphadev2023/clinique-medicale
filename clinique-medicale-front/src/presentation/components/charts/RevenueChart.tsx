// src/presentation/components/charts/RevenueChart.tsx

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { compterRevenusParMois } from "../../../domain/billing";
import type { Invoice } from "../../../domain/billing";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

interface RevenueChartProps {
  invoices: Invoice[];
}

export function RevenueChart({ invoices }: RevenueChartProps) {
  const repartition = compterRevenusParMois(invoices, 12);

  const data = {
    labels: repartition.map((r) => r.mois),
    datasets: [
      {
        label: "Revenus (FCFA)",
        data: repartition.map((r) => r.montant),
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.1)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#16a34a",
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      }}
    />
  );
}
