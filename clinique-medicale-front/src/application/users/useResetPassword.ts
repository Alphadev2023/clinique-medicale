// src/application/users/useResetPassword.ts — nouveau fichier

import { useMutation } from "@tanstack/react-query";
import { userService } from "../../infrastructure/userService";
import type { ResetPasswordPayload } from "../../domain/user";

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ResetPasswordPayload;
    }) => userService.reinitialiserMotDePasse(id, payload),
  });
}
