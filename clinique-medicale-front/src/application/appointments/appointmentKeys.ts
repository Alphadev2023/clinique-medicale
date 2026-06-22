// src/application/appointments/appointmentKeys.ts

export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  byMedecin: (medecinId: string) =>
    [...appointmentKeys.all, "medecin", medecinId] as const,
  byPatient: (patientId: string) =>
    [...appointmentKeys.all, "patient", patientId] as const,
};
