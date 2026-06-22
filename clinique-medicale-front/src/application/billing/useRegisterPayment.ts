// src/application/billing/useRegisterPayment.ts — nouveau fichier

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "../../infrastructure/billingService";
import { billingKeys } from "./billingKeys";

export function useRegisterPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, montant }: { id: string; montant: number }) =>
      billingService.paiement(id, montant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });
}
