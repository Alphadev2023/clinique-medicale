export interface InvoiceLine {
  description: string;
  quantite: number;
  prixUnitaire: number;
}

export type InvoiceStatus =
  | 'EN_ATTENTE'
  | 'PARTIELLEMENT_PAYEE'
  | 'PAYEE'
  | 'ANNULEE';

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId: string;
  prescriptionId: string;
  dateFacture: string;
  dateEcheance: string;
  lignes: InvoiceLine[];
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
  status: InvoiceStatus;
  notes: string;
  createdAt: string;
}

export interface InvoiceRequest {
  patientId: string;
  appointmentId: string;
  prescriptionId: string;
  dateFacture: string;
  dateEcheance: string;
  lignes: InvoiceLine[];
  notes: string;
}
