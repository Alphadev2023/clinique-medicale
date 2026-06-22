// src/presentation/components/RecentAppointmentsCard.tsx

import { Link } from "react-router-dom";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { getNomComplet } from "../../domain/patient";
import type { Appointment, AppointmentStatus } from "../../domain/appointment";
import type { Patient } from "../../domain/patient";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PLANIFIE: "Planifié",
  CONFIRME: "Confirmé",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

const STATUS_BADGE_VARIANT: Record<
  AppointmentStatus,
  "primary" | "success" | "neutral" | "danger"
> = {
  PLANIFIE: "primary",
  CONFIRME: "success",
  TERMINE: "neutral",
  ANNULE: "danger",
};

function formatDateHeure(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface RecentAppointmentsCardProps {
  appointments: Appointment[];
  patients: Patient[];
  voirToutHref: string;
  limite?: number;
}

export function RecentAppointmentsCard({
  appointments,
  patients,
  voirToutHref,
  limite = 5,
}: RecentAppointmentsCardProps) {
  const recents = [...appointments]
    .sort((a, b) => new Date(b.debut).getTime() - new Date(a.debut).getTime())
    .slice(0, limite);

  const patientNom = (id: string) => {
    const patient = patients.find((p) => p.id === id);
    return patient ? getNomComplet(patient) : "Patient supprimé";
  };

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Derniers rendez-vous
        </h2>
        <Link
          to={voirToutHref}
          className="text-sm text-primary-600 hover:underline"
        >
          Voir tout →
        </Link>
      </div>
      {recents.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          Aucun rendez-vous
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="px-2 py-2 font-medium">Patient</th>
              <th className="px-2 py-2 font-medium">Date</th>
              <th className="px-2 py-2 font-medium">Motif</th>
              <th className="px-2 py-2 font-medium">Salle</th>
              <th className="px-2 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {recents.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 last:border-0">
                <td className="px-2 py-2 text-gray-900">
                  {patientNom(a.patientId)}
                </td>
                <td className="px-2 py-2 text-gray-600">
                  {formatDateHeure(a.debut)}
                </td>
                <td className="px-2 py-2 text-gray-600">{a.motif ?? "—"}</td>
                <td className="px-2 py-2 text-gray-600">{a.salle ?? "—"}</td>
                <td className="px-2 py-2">
                  <Badge variant={STATUS_BADGE_VARIANT[a.status]}>
                    {STATUS_LABELS[a.status]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
