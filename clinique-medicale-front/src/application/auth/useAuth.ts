// src/application/auth/useAuth.ts

import { create } from "zustand";
import { useAuthStore } from "../../infrastructure/authStore";
import { authService } from "../../infrastructure/authService";
import { userService } from "../../infrastructure/userService";
import type { User, LoginPayload } from "../../domain/user";

interface AuthAppState {
  user: User | null;
  isInitializing: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthAppState>((set) => ({
  user: null,
  isInitializing: true,

  login: async (payload) => {
    const authResponse = await authService.login(payload);
    useAuthStore.getState().setToken(authResponse.token);
    const user = await userService.me();
    set({ user });
    return user;
  },

  logout: () => {
    useAuthStore.getState().clearAuth();
    set({ user: null });
  },

  initialize: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ isInitializing: false });
      return;
    }
    try {
      const user = await userService.me();
      set({ user, isInitializing: false });
    } catch {
      // token présent mais invalide/expiré côté serveur
      useAuthStore.getState().clearAuth();
      set({ user: null, isInitializing: false });
    }
  },
}));
