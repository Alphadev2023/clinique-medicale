// src/infrastructure/userService.ts

import { apiClient } from "./apiClient";
import type {
  User,
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdateUserPayload,
  ResetPasswordPayload,
} from "../domain/user";

export const userService = {
  lister: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>("/users");
    return data;
  },

  listerMedecins: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>("/users/medecins");
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/users/me");
    return data;
  },

  modifierProfil: async (payload: UpdateProfilePayload): Promise<User> => {
    const { data } = await apiClient.put<User>("/users/me", payload);
    return data;
  },

  changerMotDePasse: async (payload: ChangePasswordPayload): Promise<void> => {
    await apiClient.put("/users/me/password", payload);
  },

  toggleActif: async (id: string): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${id}/toggle`);
    return data;
  },

  modifierUtilisateur: async (
    id: string,
    payload: UpdateUserPayload,
  ): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${id}`, payload);
    return data;
  },

  reinitialiserMotDePasse: async (
    id: string,
    payload: ResetPasswordPayload,
  ): Promise<void> => {
    await apiClient.put(`/users/${id}/reset-password`, payload);
  },
};
