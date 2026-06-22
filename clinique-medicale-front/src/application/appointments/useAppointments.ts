// src/application/appointments/useAppointments.ts

import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../infrastructure/appointmentService";
import { appointmentKeys } from "./appointmentKeys";

export function useAppointments(medecinId?: string) {
  return useQuery({
    queryKey: medecinId
      ? appointmentKeys.byMedecin(medecinId)
      : appointmentKeys.lists(),
    queryFn: () =>
      medecinId
        ? appointmentService.listerParMedecin(medecinId)
        : appointmentService.lister(),
  });
}
