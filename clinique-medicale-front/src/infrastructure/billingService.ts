// src/infrastructure/billingService.ts

import { apiClient } from "./apiClient";
import { apiClientBlob } from "./apiClientBlob";
import type { Invoice, InvoicePayload } from "../domain/billing";

export const billingService = {
  creer: async (payload: InvoicePayload): Promise<Invoice> => {
    const { data } = await apiClient.post<Invoice>("/invoices", payload);
    return data;
  },

  lister: async (): Promise<Invoice[]> => {
    const { data } = await apiClient.get<Invoice[]>("/invoices");
    return data;
  },

  getById: async (id: string): Promise<Invoice> => {
    const { data } = await apiClient.get<Invoice>(`/invoices/${id}`);
    return data;
  },

  parPatient: async (patientId: string): Promise<Invoice[]> => {
    const { data } = await apiClient.get<Invoice[]>(
      `/invoices/patient/${patientId}`,
    );
    return data;
  },

  impayees: async (): Promise<Invoice[]> => {
    const { data } = await apiClient.get<Invoice[]>("/invoices/impayees");
    return data;
  },

  paiement: async (id: string, montant: number): Promise<Invoice> => {
    const { data } = await apiClient.patch<Invoice>(
      `/invoices/${id}/paiement`,
      null,
      { params: { montant } },
    );
    return data;
  },

  annuler: async (id: string): Promise<Invoice> => {
    const { data } = await apiClient.patch<Invoice>(`/invoices/${id}/annuler`);
    return data;
  },

  // Réservé ADMIN côté backend.
  totalRevenus: async (): Promise<number> => {
    const { data } = await apiClient.get<number>("/invoices/stats/revenus");
    return data;
  },

  // Réservé ADMIN côté backend.
  revenusParMois: async (mois: number, annee: number): Promise<number> => {
    const { data } = await apiClient.get<number>(
      "/invoices/stats/revenus/mois",
      {
        params: { mois, annee },
      },
    );
    return data;
  },

  telechargerPdf: async (id: string): Promise<Blob> => {
    const { data } = await apiClientBlob.get<Blob>(`/invoices/${id}/pdf`);
    return data;
  },
};
