// src/application/prescriptions/useCreatePrescription.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prescriptionService } from "../../infrastructure/prescriptionService";
import { prescriptionKeys } from "./prescriptionKeys";

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: prescriptionService.creer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
    },
  });
}
