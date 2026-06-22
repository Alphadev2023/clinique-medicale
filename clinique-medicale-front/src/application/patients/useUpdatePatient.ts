// src/application/patients/useUpdatePatient.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../../infrastructure/patientService";
import { patientKeys } from "./patientKeys";
import type { PatientPayload } from "../../domain/patient";

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PatientPayload }) =>
      patientService.modifier(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.id),
      });
    },
  });
}
