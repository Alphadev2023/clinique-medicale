// src/application/appointments/useCancelAppointment.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../../infrastructure/appointmentService";
import { appointmentKeys } from "./appointmentKeys";

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentService.annuler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}
