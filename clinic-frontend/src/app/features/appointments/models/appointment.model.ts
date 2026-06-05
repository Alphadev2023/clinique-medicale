export type AppointmentStatus = 'PLANIFIE' | 'CONFIRME' | 'TERMINE' | 'ANNULE';

export interface Appointment {
  id: string;
  patientId: string;
  medecinId: string;
  debut: string;
  fin: string;
  motif: string;
  salle: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface AppointmentRequest {
  patientId: string;
  medecinId: string;
  debut: string;
  fin: string;
  motif: string;
  salle: string;
  notes: string;
}
