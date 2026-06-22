// src/infrastructure/prescriptionService.ts

import { apiClient } from "./apiClient";
import { apiClientBlob } from "./apiClientBlob";
import type { Prescription, PrescriptionPayload } from "../domain/prescription";

export const prescriptionService = {
  creer: async (payload: PrescriptionPayload): Promise<Prescription> => {
    const { data } = await apiClient.post<Prescription>(
      "/prescriptions",
      payload,
    );
    return data;
  },

  getById: async (id: string): Promise<Prescription> => {
    const { data } = await apiClient.get<Prescription>(`/prescriptions/${id}`);
    return data;
  },

  parPatient: async (patientId: string): Promise<Prescription[]> => {
    const { data } = await apiClient.get<Prescription[]>(
      `/prescriptions/patient/${patientId}`,
    );
    return data;
  },

  parPatientActives: async (patientId: string): Promise<Prescription[]> => {
    const { data } = await apiClient.get<Prescription[]>(
      `/prescriptions/patient/${patientId}/actives`,
    );
    return data;
  },

  parMedecin: async (medecinId: string): Promise<Prescription[]> => {
    const { data } = await apiClient.get<Prescription[]>(
      `/prescriptions/medecin/${medecinId}`,
    );
    return data;
  },

  parAppointment: async (appointmentId: string): Promise<Prescription[]> => {
    const { data } = await apiClient.get<Prescription[]>(
      `/prescriptions/appointment/${appointmentId}`,
    );
    return data;
  },

  annuler: async (id: string): Promise<Prescription> => {
    const { data } = await apiClient.patch<Prescription>(
      `/prescriptions/${id}/annuler`,
    );
    return data;
  },

  telechargerPdf: async (id: string): Promise<Blob> => {
    const { data } = await apiClientBlob.get<Blob>(`/prescriptions/${id}/pdf`);
    return data;
  },
};
