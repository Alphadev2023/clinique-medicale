// src/application/appointments/useUpdateAppointment.ts
// Couvre confirmer + terminer (transitions de statut sans règle métier particulière).
// L'annulation a sa propre règle (24h) et son propre hook : useCancelAppointment.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../../infrastructure/appointmentService";
import { appointmentKeys } from "./appointmentKeys";

type AppointmentAction = "confirmer" | "terminer";

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: AppointmentAction }) =>
      action === "confirmer"
        ? appointmentService.confirmer(id)
        : appointmentService.terminer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}
