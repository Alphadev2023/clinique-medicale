// src/application/prescriptions/prescriptionKeys.ts

export const prescriptionKeys = {
  all: ["prescriptions"] as const,
  byPatient: (patientId: string) =>
    [...prescriptionKeys.all, "patient", patientId] as const,
  byMedecin: (medecinId: string) =>
    [...prescriptionKeys.all, "medecin", medecinId] as const,
};
