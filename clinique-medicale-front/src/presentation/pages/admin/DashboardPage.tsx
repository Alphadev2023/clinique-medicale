// src/presentation/pages/admin/DashboardPage.tsx

import {
  Users,
  CalendarCheck,
  CalendarClock,
  Coins,
  UserPlus,
  CalendarPlus,
  Receipt,
} from "lucide-react";
import { useAuth } from "../../../application/auth/useAuth";
import { usePatients } from "../../../application/patients/usePatients";
import { useAppointments } from "../../../application/appointments/useAppointments";
import { useInvoices } from "../../../application/billing/useInvoices";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { QuickAccessLink } from "../../components/ui/QuickAccessLink";
import { Spinner } from "../../components/ui/Spinner";
import { AppointmentStatusChart } from "../../components/charts/AppointmentStatusChart";
import { AppointmentsByMonthChart } from "../../components/charts/AppointmentsByMonthChart";
import { RevenueChart } from "../../components/charts/RevenueChart";
import { PatientsByGenderChart } from "../../components/charts/PatientsByGenderChart";
import { RecentAppointmentsCard } from "../../components/RecentAppointmentsCard";
import { getNomComplet } from "../../../domain/user";
import { estAujourdhui } from "../../../domain/appointment";
import { compterImpayees, calculerTotalRevenus } from "../../../domain/billing";

export default function DashboardPage() {
  const user = useAuth((state) => state.user);
  const { data: patients, isLoading: isLoadingPatients } = usePatients();
  const { data: appointments, isLoading: isLoadingAppointments } =
    useAppointments();
  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices();

  const isLoading =
    isLoadingPatients || isLoadingAppointments || isLoadingInvoices;

  const rdvAujourdhui = (appointments ?? []).filter(estAujourdhui).length;
  const rdvPlanifiesAujourdhui = (appointments ?? []).filter(
    (a) => estAujourdhui(a) && a.status === "PLANIFIE",
  ).length;
  const rdvAnnules = (appointments ?? []).filter(
    (a) => a.status === "ANNULE",
  ).length;
  const impayees = compterImpayees(invoices ?? []);
  const totalRevenus = calculerTotalRevenus(invoices ?? []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Bonjour, {user ? getNomComplet(user) : ""}
      </h1>
      <p className="mb-6 text-gray-500">Vue d'ensemble de la clinique</p>

      {isLoading ? (
        <Spinner size={32} />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total patients"
              value={patients?.length ?? 0}
              icon={<Users className="h-5 w-5" />}
              subtitle="Actifs"
              subtitleVariant="success"
            />
            <StatCard
              label="RDV aujourd'hui"
              value={rdvAujourdhui}
              icon={<CalendarClock className="h-5 w-5" />}
              variant="success"
              subtitle={`${rdvPlanifiesAujourdhui} planifiés`}
            />
            <StatCard
              label="Revenus encaissés"
              value={`${totalRevenus.toLocaleString("fr-FR")} FCFA`}
              icon={<Coins className="h-5 w-5" />}
              variant="warning"
              subtitle={`${impayees} impayées`}
              subtitleVariant="warning"
            />
            <StatCard
              label="Total RDV"
              value={appointments?.length ?? 0}
              icon={<CalendarCheck className="h-5 w-5" />}
              subtitle={`${rdvAnnules} annulés`}
              subtitleVariant="danger"
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-sm font-semibold text-gray-700">
                Répartition des RDV
              </h2>
              <AppointmentStatusChart appointments={appointments ?? []} />
            </Card>
            <Card>
              <h2 className="mb-4 text-sm font-semibold text-gray-700">
                RDV par mois
              </h2>
              <AppointmentsByMonthChart appointments={appointments ?? []} />
            </Card>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-sm font-semibold text-gray-700">
                Revenus mensuels
              </h2>
              <RevenueChart invoices={invoices ?? []} />
            </Card>
            <Card>
              <h2 className="mb-4 text-sm font-semibold text-gray-700">
                Patients par genre
              </h2>
              <PatientsByGenderChart patients={patients ?? []} />
            </Card>
          </div>

          <div className="mb-6">
            <RecentAppointmentsCard
              appointments={appointments ?? []}
              patients={patients ?? []}
              voirToutHref="/admin/rendez-vous"
            />
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Accès rapides
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <QuickAccessLink
                to="/admin/patients"
                label="Nouveau patient"
                icon={<UserPlus className="h-4 w-4" />}
              />
              <QuickAccessLink
                to="/admin/rendez-vous"
                label="Nouveau RDV"
                icon={<CalendarPlus className="h-4 w-4" />}
              />
              <QuickAccessLink
                to="/admin/facturation"
                label="Facturation"
                description="Module à venir"
                icon={<Receipt className="h-4 w-4" />}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
