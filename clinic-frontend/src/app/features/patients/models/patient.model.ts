export interface MedicalHistory {
  antecedents: string;
  maladiesChroniques: string;
  chirurgies: string;
  traitementsEnCours: string;
}

export interface Allergy {
  nom: string;
  severite: string;
  reaction: string;
}

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  genre: 'MASCULIN' | 'FEMININ' | 'AUTRE';
  adresse: string;
  numeroSecuriteSociale: string;
  historiqueMedical: MedicalHistory;
  allergies: Allergy[];
  createdAt: string;
}

export interface PatientRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  genre: string;
  adresse: string;
  numeroSecuriteSociale: string;
  historiqueMedical: MedicalHistory;
  allergies: Allergy[];
}
