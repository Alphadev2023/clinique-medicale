// src/application/users/useUpdateUser.ts — nouveau fichier

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../infrastructure/userService";
import { userKeys } from "./userKeys";
import type { UpdateUserPayload } from "../../domain/user";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userService.modifierUtilisateur(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
