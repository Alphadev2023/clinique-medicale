// src/application/auth/useLogin.ts

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import type { LoginPayload } from "../../domain/user";

export function useLogin() {
  const login = useAuth((state) => state.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}
