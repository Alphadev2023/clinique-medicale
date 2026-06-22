import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "./authStore";

function attachAuthInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );
}

export function getErrorMessage(
  error: unknown,
  fallback = "Une erreur est survenue",
): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

attachAuthInterceptors(apiClient);

export { attachAuthInterceptors };
