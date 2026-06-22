// src/infrastructure/patientService.ts

import { apiClient } from "./apiClient";
import type { Patient, PatientPayload } from "../domain/patient";

export const patientService = {
  creer: async (payload: PatientPayload): Promise<Patient> => {
    const { data } = await apiClient.post<Patient>("/patients", payload);
    return data;
  },

  lister: async (): Promise<Patient[]> => {
    const { data } = await apiClient.get<Patient[]>("/patients");
    return data;
  },

  getById: async (id: string): Promise<Patient> => {
    const { data } = await apiClient.get<Patient>(`/patients/${id}`);
    return data;
  },

  modifier: async (id: string, payload: PatientPayload): Promise<Patient> => {
    const { data } = await apiClient.put<Patient>(`/patients/${id}`, payload);
    return data;
  },

  supprimer: async (id: string): Promise<void> => {
    await apiClient.delete(`/patients/${id}`);
  },

  rechercher: async (q: string): Promise<Patient[]> => {
    const { data } = await apiClient.get<Patient[]>("/patients/search", {
      params: { q },
    });
    return data;
  },
};
