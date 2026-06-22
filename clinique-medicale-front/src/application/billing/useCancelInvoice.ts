// src/application/billing/useCancelInvoice.ts — nouveau fichier

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "../../infrastructure/billingService";
import { billingKeys } from "./billingKeys";

export function useCancelInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billingService.annuler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });
}
