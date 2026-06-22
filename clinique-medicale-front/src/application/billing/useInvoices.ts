// src/application/billing/useInvoices.ts

import { useQuery } from "@tanstack/react-query";
import { billingService } from "../../infrastructure/billingService";
import { billingKeys } from "./billingKeys";

export function useInvoices() {
  return useQuery({
    queryKey: billingKeys.lists(),
    queryFn: billingService.lister,
  });
}
