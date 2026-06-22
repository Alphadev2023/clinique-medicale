// src/presentation/components/PrescriptionsManager.tsx

import { useState } from "react";
import { Plus, Download, Ban, Search } from "lucide-react";
import { usePrescriptions } from "../../application/prescriptions/usePrescriptions";
import { useCancelPrescription } from "../../application/prescriptions/useCancelPrescription";
import { useDownloadPrescriptionPdf } from "../../application/prescriptions/useDownloadPrescriptionPdf";
import { usePatients } from "../../application/patients/usePatients";
import { useAuth } from "../../application/auth/useAuth";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { Badge } from "./ui/Badge";
import { Spinner } from "./ui/Spinner";
import { Table } from "./ui/Table";
import { PrescriptionFormModal } from "./PrescriptionFormModal";
import { peutAnnulerPrescription, estExpiree } from "../../domain/prescription";
import { getNomComplet } from "../../domain/patient";
import type {
  Prescription,
  PrescriptionStatus,
} from "../../domain/prescription";

const STATUS_LABELS: Record<PrescriptionStatus, string> = {
  ACTIVE: "Active",
  EXPIREE: "Expirée",
  ANNULEE: "Annulée",
};

const STATUS_BADGE_VARIANT: Record<
  PrescriptionStatus,
  "success" | "neutral" | "danger"
> = {
  ACTIVE: "success",
  EXPIREE: "neutral",
  ANNULEE: "danger",
};

function getStatutAffiche(p: Prescription): PrescriptionStatus {
  if (p.status === "ANNULEE") return "ANNULEE";
  return estExpiree(p) ? "EXPIREE" : "ACTIVE";
}

export function PrescriptionsManager() {
  const user = useAuth((state) => state.user);
  const isMedecin = user?.role === "MEDECIN";
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: patients } = usePatients();
  const { data: prescriptions, isLoading } = usePrescriptions(
    isMedecin
      ? { medecinId: user?.id }
      : { patientId: selectedPatientId || undefined },
  );
  const { mutate: annuler } = useCancelPrescription();
  const { mutate: telecharger } = useDownloadPrescriptionPdf();

  const patientOptions = (patients ?? []).map((p) => ({
    value: p.id,
    label: getNomComplet(p),
  }));

  const patientNom = (id: string) => {
    const patient = patients?.find((p) => p.id === id);
    return patient ? getNomComplet(patient) : "Patient supprimé";
  };

  function handleAnnuler(p: Prescription) {
    if (window.confirm("Annuler cette prescription ?")) {
      annuler(p.id);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        {!isMedecin && (
          <div className="w-full max-w-sm">
            <Select
              options={patientOptions}
              placeholder="Sélectionner un patient pour voir ses prescriptions"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            />
          </div>
        )}
        <Button variant="primary" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Nouvelle prescription
        </Button>
      </div>

      {!isMedecin && !selectedPatientId ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
          <Search className="h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            Sélectionne un patient ci-dessus pour voir ses prescriptions.
          </p>
        </div>
      ) : isLoading ? (
        <Spinner size={32} />
      ) : (
        <Table<Prescription>
          data={prescriptions ?? []}
          keyExtractor={(p) => p.id}
          emptyMessage="Aucune prescription"
          columns={[
            ...(isMedecin
              ? [
                  {
                    header: "Patient",
                    accessor: (p: Prescription) => patientNom(p.patientId),
                  },
                ]
              : []),
            {
              header: "Date",
              accessor: (p) =>
                new Date(p.datePrescription).toLocaleDateString("fr-FR"),
            },
            {
              header: "Expiration",
              accessor: (p) =>
                new Date(p.dateExpiration).toLocaleDateString("fr-FR"),
            },
            { header: "Diagnostic", accessor: (p) => p.diagnostic ?? "—" },
            {
              header: "Médicaments",
              accessor: (p) =>
                p.medicaments.map((m) => m.medicament).join(", "),
            },
            {
              header: "Statut",
              accessor: (p) => {
                const statut = getStatutAffiche(p);
                return (
                  <Badge variant={STATUS_BADGE_VARIANT[statut]}>
                    {STATUS_LABELS[statut]}
                  </Badge>
                );
              },
            },
            {
              header: "Actions",
              accessor: (p) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => telecharger(p.id)}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                    aria-label="Télécharger le PDF"
                    title="Télécharger le PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  {peutAnnulerPrescription(p) && (
                    <button
                      onClick={() => handleAnnuler(p)}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-danger-600"
                      aria-label="Annuler"
                      title="Annuler"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      <PrescriptionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        patientIdPreselectionne={
          !isMedecin ? selectedPatientId || undefined : undefined
        }
      />
    </div>
  );
}
