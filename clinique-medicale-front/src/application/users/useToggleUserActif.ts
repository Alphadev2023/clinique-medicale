// src/application/users/useToggleUserActif.ts — nouveau fichier, à créer (non présent dans le script initial)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../infrastructure/userService";
import { userKeys } from "./userKeys";

export function useToggleUserActif() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.toggleActif,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
