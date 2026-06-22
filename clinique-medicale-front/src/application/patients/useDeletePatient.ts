// src/application/patients/useDeletePatient.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../../infrastructure/patientService";
import { patientKeys } from "./patientKeys";

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}
