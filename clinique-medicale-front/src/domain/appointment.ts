// src/domain/appointment.ts

export type AppointmentStatus = "PLANIFIE" | "CONFIRME" | "TERMINE" | "ANNULE";

export interface Appointment {
  id: string;
  patientId: string;
  medecinId: string;
  debut: string; // ISO datetime
  fin: string; // ISO datetime
  motif: string | null;
  salle: string | null;
  notes: string | null;
  status: AppointmentStatus;
  createdAt: string;
}

export interface AppointmentPayload {
  patientId: string;
  medecinId: string;
  debut: string;
  fin: string;
  motif?: string;
  salle?: string;
  notes?: string;
}

export function getDureeMinutes(
  appointment: Pick<Appointment, "debut" | "fin">,
): number {
  const debut = new Date(appointment.debut).getTime();
  const fin = new Date(appointment.fin).getTime();
  return Math.round((fin - debut) / 60000);
}

export function estAnnulable(
  appointment: Pick<Appointment, "debut" | "status">,
): boolean {
  if (appointment.status === "ANNULE" || appointment.status === "TERMINE")
    return false;
  const heuresAvant =
    (new Date(appointment.debut).getTime() - Date.now()) / (1000 * 60 * 60);
  return heuresAvant >= 24;
}

export function estPasse(appointment: Pick<Appointment, "fin">): boolean {
  return new Date(appointment.fin).getTime() < Date.now();
}

export function estAujourdhui(
  appointment: Pick<Appointment, "debut">,
): boolean {
  const debut = new Date(appointment.debut);
  const maintenant = new Date();
  return (
    debut.getFullYear() === maintenant.getFullYear() &&
    debut.getMonth() === maintenant.getMonth() &&
    debut.getDate() === maintenant.getDate()
  );
}

export function compterParStatut(
  appointments: Appointment[],
): Record<AppointmentStatus, number> {
  const compteur: Record<AppointmentStatus, number> = {
    PLANIFIE: 0,
    CONFIRME: 0,
    TERMINE: 0,
    ANNULE: 0,
  };
  for (const appointment of appointments) {
    compteur[appointment.status]++;
  }
  return compteur;
}

export interface RepartitionMensuelle {
  mois: string;
  count: number;
}

/**
 * Répartit les RDV sur les N derniers mois (par défaut 6), mois courant inclus.
 */
export function compterParMois(
  appointments: Appointment[],
  nombreMois = 6,
): RepartitionMensuelle[] {
  const maintenant = new Date();
  const mois: RepartitionMensuelle[] = [];

  for (let i = nombreMois - 1; i >= 0; i--) {
    const date = new Date(
      maintenant.getFullYear(),
      maintenant.getMonth() - i,
      1,
    );
    const label = date.toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    });
    const count = appointments.filter((a) => {
      const debut = new Date(a.debut);
      return (
        debut.getFullYear() === date.getFullYear() &&
        debut.getMonth() === date.getMonth()
      );
    }).length;
    mois.push({ mois: label, count });
  }

  return mois;
}
