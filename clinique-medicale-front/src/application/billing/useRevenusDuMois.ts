// src/application/billing/useRevenusDuMois.ts — nouveau fichier

import { useQuery } from "@tanstack/react-query";
import { billingService } from "../../infrastructure/billingService";
import { billingKeys } from "./billingKeys";

export function useRevenusDuMois(mois: number, annee: number) {
  return useQuery({
    queryKey: [...billingKeys.all, "revenus-mois", mois, annee],
    queryFn: () => billingService.revenusParMois(mois, annee),
  });
}
