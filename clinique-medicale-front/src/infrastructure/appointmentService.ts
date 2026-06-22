// src/infrastructure/appointmentService.ts

import { apiClient } from "./apiClient";
import type { Appointment, AppointmentPayload } from "../domain/appointment";

export const appointmentService = {
  creer: async (payload: AppointmentPayload): Promise<Appointment> => {
    const { data } = await apiClient.post<Appointment>(
      "/appointments",
      payload,
    );
    return data;
  },

  lister: async (): Promise<Appointment[]> => {
    const { data } = await apiClient.get<Appointment[]>("/appointments");
    return data;
  },

  listerParMedecin: async (medecinId: string): Promise<Appointment[]> => {
    const { data } = await apiClient.get<Appointment[]>(
      `/appointments/medecin/${medecinId}`,
    );
    return data;
  },

  listerParPatient: async (patientId: string): Promise<Appointment[]> => {
    const { data } = await apiClient.get<Appointment[]>(
      `/appointments/patient/${patientId}`,
    );
    return data;
  },

  listerParPeriode: async (
    debut: string,
    fin: string,
  ): Promise<Appointment[]> => {
    const { data } = await apiClient.get<Appointment[]>(
      "/appointments/periode",
      {
        params: { debut, fin },
      },
    );
    return data;
  },

  confirmer: async (id: string): Promise<Appointment> => {
    const { data } = await apiClient.patch<Appointment>(
      `/appointments/${id}/confirmer`,
    );
    return data;
  },

  annuler: async (id: string): Promise<Appointment> => {
    const { data } = await apiClient.patch<Appointment>(
      `/appointments/${id}/annuler`,
    );
    return data;
  },

  terminer: async (id: string): Promise<Appointment> => {
    const { data } = await apiClient.patch<Appointment>(
      `/appointments/${id}/terminer`,
    );
    return data;
  },
};
