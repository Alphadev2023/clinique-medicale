// src/presentation/components/PatientsManager.tsx

import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { usePatients } from "../../application/patients/usePatients";
import { useDeletePatient } from "../../application/patients/useDeletePatient";
import { useAuth } from "../../application/auth/useAuth";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { Spinner } from "./ui/Spinner";
import { Table } from "./ui/Table";
import { PatientFormModal } from "./PatientFormModal";
import {
  calculerAge,
  getNomComplet,
  getSeveriteMax,
} from "../../domain/patient";
import type { Patient, AllergySeverite } from "../../domain/patient";

const SEVERITE_BADGE_VARIANT: Record<
  AllergySeverite,
  "success" | "warning" | "danger"
> = {
  LÉGÈRE: "success",
  MODÉRÉE: "warning",
  SÉVÈRE: "danger",
};

export function PatientsManager() {
  const user = useAuth((state) => state.user);
  const [search, setSearch] = useState("");
  const [modalState, setModalState] = useState<{
    open: boolean;
    patient: Patient | null;
  }>({
    open: false,
    patient: null,
  });

  const { data: patients, isLoading } = usePatients(search || undefined);
  const { mutate: supprimer } = useDeletePatient();

  const peutModifier = user?.role === "ADMIN" || user?.role === "MEDECIN";
  const peutSupprimer = user?.role === "ADMIN";

  function handleDelete(patient: Patient) {
    if (window.confirm(`Supprimer le patient ${getNomComplet(patient)} ?`)) {
      supprimer(patient.id);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un patient..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          onClick={() => setModalState({ open: true, patient: null })}
        >
          <Plus className="h-4 w-4" />
          Nouveau patient
        </Button>
      </div>

      {isLoading ? (
        <Spinner size={32} />
      ) : (
        <Table<Patient>
          data={patients ?? []}
          keyExtractor={(p) => p.id}
          emptyMessage="Aucun patient trouvé"
          columns={[
            { header: "Nom", accessor: (p) => getNomComplet(p) },
            { header: "Âge", accessor: (p) => calculerAge(p.dateNaissance) },
            { header: "Email", accessor: (p) => p.email },
            { header: "Téléphone", accessor: (p) => p.telephone ?? "—" },
            {
              header: "Allergies",
              accessor: (p) => {
                const max = getSeveriteMax(p.allergies);
                if (!max) return <span className="text-gray-400">Aucune</span>;
                return (
                  <Badge variant={SEVERITE_BADGE_VARIANT[max]}>{max}</Badge>
                );
              },
            },
            {
              header: "Actions",
              accessor: (p) => (
                <div className="flex gap-2">
                  {peutModifier && (
                    <button
                      onClick={() => setModalState({ open: true, patient: p })}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                      aria-label="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {peutSupprimer && (
                    <button
                      onClick={() => handleDelete(p)}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-danger-600"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      <PatientFormModal
        isOpen={modalState.open}
        onClose={() => setModalState({ open: false, patient: null })}
        patient={modalState.patient}
      />
    </div>
  );
}
