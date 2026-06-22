// src/presentation/components/AppointmentDetailModal.tsx

import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { useUpdateAppointment } from "../../application/appointments/useUpdateAppointment";
import { useCancelAppointment } from "../../application/appointments/useCancelAppointment";
import { usePatients } from "../../application/patients/usePatients";
import { useMedecins } from "../../application/users/useMedecins";
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export function AppointmentDetailModal({
  appointment,
  onClose,
}: AppointmentDetailModalProps) {
  const { data: patients } = usePatients();
  const { data: medecins } = useMedecins();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateAppointment();
  const { mutate: annuler, isPending: isCanceling } = useCancelAppointment();

  if (!appointment) return null;

  const patient = patients?.find((p) => p.id === appointment.patientId);
  const medecin = medecins?.find((m) => m.id === appointment.medecinId);

  function handleAnnuler() {
    if (!appointment) return;
    if (!estAnnulable(appointment)) {
      window.alert(
        "Ce rendez-vous ne peut plus être annulé : moins de 24h avant le début, ou statut déjà final.",
      );
      return;
    }
    if (window.confirm("Annuler ce rendez-vous ?")) {
      annuler(appointment.id, { onSuccess: onClose });
    }
  }

  return (
    <Modal
      isOpen={appointment !== null}
      onClose={onClose}
      title="Détails du rendez-vous"
    >
      <div className="space-y-4">
        <Badge variant={STATUS_BADGE_VARIANT[appointment.status]}>
          {STATUS_LABELS[appointment.status]}
        </Badge>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Patient</dt>
            <dd className="font-medium text-gray-900">
              {patient ? getNomCompletPatient(patient) : "Patient supprimé"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Médecin</dt>
            <dd className="font-medium text-gray-900">
              {medecin ? getNomCompletUser(medecin) : "—"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Début</dt>
            <dd className="text-gray-900">
              {formatDateHeure(appointment.debut)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Fin</dt>
            <dd className="text-gray-900">
              {formatDateHeure(appointment.fin)}
            </dd>
          </div>
          {appointment.motif && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Motif</dt>
              <dd className="text-gray-900">{appointment.motif}</dd>
            </div>
          )}
          {appointment.salle && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Salle</dt>
              <dd className="text-gray-900">{appointment.salle}</dd>
            </div>
          )}
          {appointment.notes && (
            <div>
              <dt className="text-gray-500">Notes</dt>
              <dd className="mt-1 text-gray-900">{appointment.notes}</dd>
            </div>
          )}
        </dl>

        <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4">
          {appointment.status === "PLANIFIE" && (
            <Button
              variant="ghost"
              isLoading={isUpdating}
              onClick={() =>
                updateStatus(
                  { id: appointment.id, action: "confirmer" },
                  { onSuccess: onClose },
                )
              }
            >
              Confirmer
            </Button>
          )}
          {(appointment.status === "PLANIFIE" ||
            appointment.status === "CONFIRME") && (
            <Button
              variant="ghost"
              isLoading={isUpdating}
              onClick={() =>
                updateStatus(
                  { id: appointment.id, action: "terminer" },
                  { onSuccess: onClose },
                )
              }
            >
              Marquer terminé
            </Button>
          )}
          {(appointment.status === "PLANIFIE" ||
            appointment.status === "CONFIRME") && (
            <Button
              variant="danger"
              isLoading={isCanceling}
              onClick={handleAnnuler}
            >
              Annuler
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
