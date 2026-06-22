// src/application/billing/useCreateInvoice.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "../../infrastructure/billingService";
import { billingKeys } from "./billingKeys";

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billingService.creer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });
}
