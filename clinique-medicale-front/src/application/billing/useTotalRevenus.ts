// src/application/billing/useTotalRevenus.ts — nouveau fichier, pas dans le scaffold initial

import { useQuery } from "@tanstack/react-query";
import { billingService } from "../../infrastructure/billingService";
import { billingKeys } from "./billingKeys";

export function useTotalRevenus() {
  return useQuery({
    queryKey: billingKeys.totalRevenus(),
    queryFn: billingService.totalRevenus,
  });
}
