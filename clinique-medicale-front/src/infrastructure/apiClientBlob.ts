import axios, { type AxiosInstance } from "axios";
import { attachAuthInterceptors } from "./apiClient";

export const apiClientBlob: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  responseType: "blob",
});

attachAuthInterceptors(apiClientBlob);

/**
 * Déclenche le téléchargement d'un Blob (PDF, Excel...) sous le nom de fichier donné.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
