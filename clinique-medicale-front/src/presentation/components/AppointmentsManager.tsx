// src/presentation/components/AppointmentsManager.tsx

import { useState } from "react";
import { Plus, Check, X, CheckCheck } from "lucide-react";
import { useAppointments } from "../../application/appointments/useAppointments";
import { useUpdateAppointment } from "../../application/appointments/useUpdateAppointment";
import { useCancelAppointment } from "../../application/appointments/useCancelAppointment";
import { usePatients } from "../../application/patients/usePatients";
import { useMedecins } from "../../application/users/useMedecins";
import { useAuth } from "../../application/auth/useAuth";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Spinner } from "./ui/Spinner";
import { Table } from "./ui/Table";
import { AppointmentFormModal } from "./AppointmentFormModal";
import { estAnnulable } from "../../domain/appointment";
import { getNomComplet as getNomCompletPatient } from "../../domain/patient";
import { getNomComplet as getNomCompletUser } from "../../domain/user";
import type { Appointment, AppointmentStatus } from "../../domain/appointment";

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
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AppointmentsManager() {
  const user = useAuth((state) => state.user);
  const isMedecin = user?.role === "MEDECIN";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: appointments, isLoading } = useAppointments(
    isMedecin ? user?.id : undefined,
  );
  const { data: patients } = usePatients();
  const { data: medecins } = useMedecins();
  const { mutate: updateStatus } = useUpdateAppointment();
  const { mutate: annuler } = useCancelAppointment();

  const patientNom = (id: string) => {
    const patient = patients?.find((p) => p.id === id);
    return patient ? getNomCompletPatient(patient) : "Patient supprimé";
  };

  const medecinNom = (id: string) => {
    const medecin = medecins?.find((m) => m.id === id);
    return medecin ? getNomCompletUser(medecin) : id;
  };

  function handleAnnuler(appointment: Appointment) {
    if (!estAnnulable(appointment)) {
      window.alert(
        "Ce rendez-vous ne peut plus être annulé : moins de 24h avant le début, ou statut déjà final.",
      );
      return;
    }
    if (window.confirm("Annuler ce rendez-vous ?")) {
      annuler(appointment.id);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>

      {isLoading ? (
        <Spinner size={32} />
      ) : (
        <Table<Appointment>
          data={appointments ?? []}
          keyExtractor={(a) => a.id}
          emptyMessage="Aucun rendez-vous"
          columns={[
            { header: "Patient", accessor: (a) => patientNom(a.patientId) },
            { header: "Médecin", accessor: (a) => medecinNom(a.medecinId) },
            { header: "Début", accessor: (a) => formatDateHeure(a.debut) },
            { header: "Motif", accessor: (a) => a.motif ?? "—" },
            { header: "Salle", accessor: (a) => a.salle ?? "—" },
            {
              header: "Statut",
              accessor: (a) => (
                <Badge variant={STATUS_BADGE_VARIANT[a.status]}>
                  {STATUS_LABELS[a.status]}
                </Badge>
              ),
            },
            {
              header: "Actions",
              accessor: (a) => (
                <div className="flex gap-2">
                  {a.status === "PLANIFIE" && (
                    <button
                      onClick={() =>
                        updateStatus({ id: a.id, action: "confirmer" })
                      }
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-success-600"
                      aria-label="Confirmer"
                      title="Confirmer"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {(a.status === "PLANIFIE" || a.status === "CONFIRME") && (
                    <button
                      onClick={() =>
                        updateStatus({ id: a.id, action: "terminer" })
                      }
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                      aria-label="Terminer"
                      title="Marquer comme terminé"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  )}
                  {(a.status === "PLANIFIE" || a.status === "CONFIRME") && (
                    <button
                      onClick={() => handleAnnuler(a)}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-danger-600"
                      aria-label="Annuler"
                      title="Annuler"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
