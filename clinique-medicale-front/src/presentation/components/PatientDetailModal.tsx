// src/presentation/components/PatientDetailModal.tsx

import { Pencil } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { calculerAge, getNomComplet } from "../../domain/patient";
import type { Patient, AllergySeverite } from "../../domain/patient";

const SEVERITE_BADGE_VARIANT: Record<
  AllergySeverite,
  "success" | "warning" | "danger"
> = {
  LÉGÈRE: "success",
  MODÉRÉE: "warning",
  SÉVÈRE: "danger",
};

interface PatientDetailModalProps {
  patient: Patient | null;
  onClose: () => void;
  onEdit?: (patient: Patient) => void;
}

export function PatientDetailModal({
  patient,
  onClose,
  onEdit,
}: PatientDetailModalProps) {
  if (!patient) return null;

  const h = patient.historiqueMedical;
  const aHistorique =
    h &&
    (h.antecedents ||
      h.maladiesChroniques ||
      h.chirurgies ||
      h.traitementsEnCours);

  return (
    <Modal
      isOpen={patient !== null}
      onClose={onClose}
      title={getNomComplet(patient)}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500">Âge</dt>
            <dd className="text-gray-900">
              {calculerAge(patient.dateNaissance)} ans
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Genre</dt>
            <dd className="text-gray-900">{patient.genre ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Téléphone</dt>
            <dd className="text-gray-900">{patient.telephone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900">{patient.email}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-gray-500">Adresse</dt>
            <dd className="text-gray-900">{patient.adresse ?? "—"}</dd>
          </div>
        </dl>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            Allergies
          </h3>
          {patient.allergies.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune allergie connue.</p>
          ) : (
            <div className="space-y-2">
              {patient.allergies.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-gray-200 p-2 text-sm"
                >
                  <div>
                    <span className="font-medium text-gray-900">{a.nom}</span>
                    <span className="ml-2 text-gray-500">{a.reaction}</span>
                  </div>
                  <Badge variant={SEVERITE_BADGE_VARIANT[a.severite]}>
                    {a.severite}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            Historique médical
          </h3>
          {!aHistorique ? (
            <p className="text-sm text-gray-500">Aucun historique renseigné.</p>
          ) : (
            <dl className="space-y-2 text-sm">
              {h?.antecedents && (
                <div>
                  <dt className="text-gray-500">Antécédents</dt>
                  <dd className="text-gray-900">{h.antecedents}</dd>
                </div>
              )}
              {h?.maladiesChroniques && (
                <div>
                  <dt className="text-gray-500">Maladies chroniques</dt>
                  <dd className="text-gray-900">{h.maladiesChroniques}</dd>
                </div>
              )}
              {h?.chirurgies && (
                <div>
                  <dt className="text-gray-500">Chirurgies</dt>
                  <dd className="text-gray-900">{h.chirurgies}</dd>
                </div>
              )}
              {h?.traitementsEnCours && (
                <div>
                  <dt className="text-gray-500">Traitements en cours</dt>
                  <dd className="text-gray-900">{h.traitementsEnCours}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          {onEdit && (
            <Button variant="ghost" onClick={() => onEdit(patient)}>
              <Pencil className="h-4 w-4" />
              Modifier
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
