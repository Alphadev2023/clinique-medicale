// src/application/prescriptions/useCancelPrescription.ts — nouveau fichier, pas dans le scaffold initial

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prescriptionService } from "../../infrastructure/prescriptionService";
import { prescriptionKeys } from "./prescriptionKeys";

export function useCancelPrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: prescriptionService.annuler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.all });
    },
  });
}
