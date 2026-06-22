// src/presentation/pages/medecin/DashboardPage.tsx

import {
  Users,
  CalendarClock,
  CalendarCheck,
  CalendarPlus,
} from "lucide-react";
import { useAuth } from "../../../application/auth/useAuth";
import { useAppointments } from "../../../application/appointments/useAppointments";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { QuickAccessLink } from "../../components/ui/QuickAccessLink";
import { Spinner } from "../../components/ui/Spinner";
import { AppointmentStatusChart } from "../../components/charts/AppointmentStatusChart";
import { getNomComplet } from "../../../domain/user";
import { estAujourdhui } from "../../../domain/appointment";

export default function DashboardPage() {
  const user = useAuth((state) => state.user);
  const { data: appointments, isLoading } = useAppointments(user?.id);

  const rdvAujourdhui = (appointments ?? []).filter(estAujourdhui).length;
  const rdvPlanifies = (appointments ?? []).filter(
    (a) => a.status === "PLANIFIE",
  ).length;
  // Approximation : patients distincts parmi mes RDV, en attendant un vrai endpoint "mes patients".
  const patientsDistincts = new Set(
    (appointments ?? []).map((a) => a.patientId),
  ).size;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Bonjour, {user ? getNomComplet(user) : ""}
      </h1>
      <p className="mb-6 text-gray-500">Votre activité</p>

      {isLoading ? (
        <Spinner size={32} />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="RDV aujourd'hui"
              value={rdvAujourdhui}
              icon={<CalendarClock className="h-5 w-5" />}
              variant="success"
            />
            <StatCard
              label="Mes patients"
              value={patientsDistincts}
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              label="Total RDV"
              value={appointments?.length ?? 0}
              icon={<CalendarCheck className="h-5 w-5" />}
            />
            <StatCard
              label="RDV à confirmer"
              value={rdvPlanifies}
              icon={<CalendarClock className="h-5 w-5" />}
              variant="warning"
            />
          </div>

          <div className="mb-6 grid grid-cols-1 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-sm font-semibold text-gray-700">
                Répartition de mes RDV
              </h2>
              <AppointmentStatusChart appointments={appointments ?? []} />
            </Card>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Accès rapides
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <QuickAccessLink
                to="/medecin/rendez-vous"
                label="Mes rendez-vous"
                icon={<CalendarPlus className="h-4 w-4" />}
              />
              <QuickAccessLink
                to="/medecin/mes-patients"
                label="Mes patients"
                icon={<Users className="h-4 w-4" />}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
