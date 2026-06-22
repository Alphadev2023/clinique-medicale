// src/application/prescriptions/usePrescriptions.ts

import { useQuery } from "@tanstack/react-query";
import { prescriptionService } from "../../infrastructure/prescriptionService";
import { prescriptionKeys } from "./prescriptionKeys";

interface UsePrescriptionsParams {
  patientId?: string;
  medecinId?: string;
}

export function usePrescriptions({
  patientId,
  medecinId,
}: UsePrescriptionsParams) {
  return useQuery({
    queryKey: patientId
      ? prescriptionKeys.byPatient(patientId)
      : prescriptionKeys.byMedecin(medecinId ?? ""),
    queryFn: () => {
      if (patientId) return prescriptionService.parPatient(patientId);
      if (medecinId) return prescriptionService.parMedecin(medecinId);
      return Promise.resolve([]);
    },
    enabled: Boolean(patientId || medecinId),
  });
}
