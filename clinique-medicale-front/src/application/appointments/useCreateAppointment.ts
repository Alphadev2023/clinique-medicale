// src/application/appointments/useCreateAppointment.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../../infrastructure/appointmentService";
import { appointmentKeys } from "./appointmentKeys";

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentService.creer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}
