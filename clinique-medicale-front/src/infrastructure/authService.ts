// src/infrastructure/authService.ts

import { apiClient } from "./apiClient";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../domain/user";

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },
};
