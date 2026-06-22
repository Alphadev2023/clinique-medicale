// src/application/patients/usePatients.ts

import { useQuery } from "@tanstack/react-query";
import { patientService } from "../../infrastructure/patientService";
import { patientKeys } from "./patientKeys";

export function usePatients(search?: string) {
  return useQuery({
    queryKey: patientKeys.list(search),
    queryFn: () =>
      search ? patientService.rechercher(search) : patientService.lister(),
  });
}
