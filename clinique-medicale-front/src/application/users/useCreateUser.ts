// src/application/users/useCreateUser.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../infrastructure/authService";
import { userKeys } from "./userKeys";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
