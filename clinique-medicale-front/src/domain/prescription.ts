// src/domain/prescription.ts

export type PrescriptionStatus = "ACTIVE" | "EXPIREE" | "ANNULEE";

export interface DrugLine {
  medicament: string;
  dosage: string;
  frequence: string;
  duree: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medecinId: string;
  appointmentId: string | null;
  datePrescription: string; // YYYY-MM-DD
  dateExpiration: string; // YYYY-MM-DD
  medicaments: DrugLine[];
  diagnostic: string | null;
  notes: string | null;
  status: PrescriptionStatus;
  createdAt: string;
}

export interface PrescriptionPayload {
  patientId: string;
  medecinId: string;
  appointmentId?: string;
  datePrescription: string;
  dateExpiration: string;
  medicaments: DrugLine[];
  diagnostic?: string;
  notes?: string;
}

/**
 * Le backend a une méthode verifierExpirations() qui bascule ACTIVE → EXPIREE,
 * mais aucun endpoint ne l'expose et son déclenchement (job planifié ?) n'est pas confirmé.
 * On recalcule donc côté client pour ne pas afficher un statut "Active" périmé.
 */
export function estExpiree(
  prescription: Pick<Prescription, "dateExpiration" | "status">,
): boolean {
  if (prescription.status !== "ACTIVE")
    return prescription.status === "EXPIREE";
  return new Date(prescription.dateExpiration).getTime() < Date.now();
}

/** Reflète la règle backend : annuler() ne vérifie rien d'autre que l'existence de la prescription,
 * mais annuler une prescription déjà expirée/annulée n'a pas de sens côté UX. */
export function peutAnnulerPrescription(
  prescription: Pick<Prescription, "status">,
): boolean {
  return prescription.status === "ACTIVE";
}

export function joursAvantExpiration(
  prescription: Pick<Prescription, "dateExpiration">,
): number {
  const expiration = new Date(prescription.dateExpiration).getTime();
  return Math.ceil((expiration - Date.now()) / (1000 * 60 * 60 * 24));
}
