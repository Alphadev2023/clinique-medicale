export interface DrugLine {
  medicament: string;
  dosage: string;
  frequence: string;
  duree: string;
  instructions: string;
}

export type PrescriptionStatus = 'ACTIVE' | 'EXPIREE' | 'ANNULEE';

export interface Prescription {
  id: string;
  patientId: string;
  medecinId: string;
  appointmentId: string;
  datePrescription: string;
  dateExpiration: string;
  medicaments: DrugLine[];
  diagnostic: string;
  notes: string;
  status: PrescriptionStatus;
  createdAt: string;
}

export interface PrescriptionRequest {
  patientId: string;
  medecinId: string;
  appointmentId: string;
  datePrescription: string;
  dateExpiration: string;
  medicaments: DrugLine[];
  diagnostic: string;
  notes: string;
}
