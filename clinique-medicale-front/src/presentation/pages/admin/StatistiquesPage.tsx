// src/presentation/pages/admin/StatistiquesPage.tsx

import { Coins, CalendarRange, Users, CalendarCheck } from "lucide-react";
import { usePatients } from "../../../application/patients/usePatients";
import { useAppointments } from "../../../application/appointments/useAppointments";
import { useInvoices } from "../../../application/billing/useInvoices";
import { useTotalRevenus } from "../../../application/billing/useTotalRevenus";
import { useRevenusDuMois } from "../../../application/billing/useRevenusDuMois";
import { StatCard } from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { AppointmentStatusChart } from "../../components/charts/AppointmentStatusChart";
import { AppointmentsByMonthChart } from "../../components/charts/AppointmentsByMonthChart";
import { RevenueChart } from "../../components/charts/RevenueChart";
import { PatientsByGenderChart } from "../../components/charts/PatientsByGenderChart";
import type { InvoiceStatus } from "../../../domain/billing";

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  EN_ATTENTE: "En attente",
  PARTIELLEMENT_PAYEE: "Partiellement payée",
  PAYEE: "Payée",
  ANNULEE: "Annulée",
};

const STATUS_BADGE_VARIANT: Record<
  InvoiceStatus,
  "primary" | "success" | "warning" | "danger"
> = {
  EN_ATTENTE: "warning",
  PARTIELLEMENT_PAYEE: "primary",
  PAYEE: "success",
  ANNULEE: "danger",
};

export default function StatistiquesPage() {
  const maintenant = new Date();
  const { data: patients, isLoading: isLoadingPatients } = usePatients();
  const { data: appointments, isLoading: isLoadingAppointments } =
    useAppointments();
  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices();
  const { data: totalRevenus, isLoading: isLoadingTotal } = useTotalRevenus();
  const { data: revenusDuMois, isLoading: isLoadingMois } = useRevenusDuMois(
    maintenant.getMonth() + 1,
    maintenant.getFullYear(),
  );

  const isLoading =
    isLoadingPatients ||
    isLoadingAppointments ||
    isLoadingInvoices ||
    isLoadingTotal ||
    isLoadingMois;

  const repartitionStatuts: InvoiceStatus[] = [
    "EN_ATTENTE",
    "PARTIELLEMENT_PAYEE",
    "PAYEE",
    "ANNULEE",
  ];
  const compterParStatut = (statut: InvoiceStatus) =>
    (invoices ?? []).filter((i) => i.status === statut).length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">
        Statistiques
      </h1>

      {isLoading ? (
        <Spinner size={32} />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Revenus totaux"
              value={`${(totalRevenus ?? 0).toLocaleString("fr-FR")} FCFA`}
              icon={<Coins className="h-5 w-5" />}
              variant="success"
              subtitle="Toutes périodes confondues"
            />
            <StatCard
              label="Revenus ce mois-ci"
              value={`${(revenusDuMois ?? 0).toLocaleString("fr-FR")} FCFA`}
              icon={<CalendarRange className="h-5 w-5" />}
              variant="warning"
              subtitle={maintenant.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            />
            <StatCard
              label="Total patients"
              value={patients?.length ?? 0}
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              label="Total rendez-vous"
              value={appointments?.length ?? 0}
              icon={<CalendarCheck className="h-5 w-5" />}
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
                Patients par genre
              </h2>
              <PatientsByGenderChart patients={patients ?? []} />
            </Card>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-sm font-semibold text-gray-700">
                RDV par mois
              </h2>
              <AppointmentsByMonthChart appointments={appointments ?? []} />
            </Card>
            <Card>
              <h2 className="mb-4 text-sm font-semibold text-gray-700">
                Revenus mensuels
              </h2>
              <RevenueChart invoices={invoices ?? []} />
            </Card>
          </div>

          <Card>
            <h2 className="mb-4 text-sm font-semibold text-gray-700">
              Factures par statut
            </h2>
            <div className="flex flex-wrap gap-3">
              {repartitionStatuts.map((statut) => (
                <div
                  key={statut}
                  className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2"
                >
                  <Badge variant={STATUS_BADGE_VARIANT[statut]}>
                    {STATUS_LABELS[statut]}
                  </Badge>
                  <span className="text-sm font-semibold text-gray-900">
                    {compterParStatut(statut)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
