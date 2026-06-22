// src/application/patients/useCreatePatient.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../../infrastructure/patientService";
import { patientKeys } from "./patientKeys";

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.creer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}
