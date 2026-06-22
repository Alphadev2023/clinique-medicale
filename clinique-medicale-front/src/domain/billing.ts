// src/domain/billing.ts

export type InvoiceStatus =
  | "EN_ATTENTE"
  | "PARTIELLEMENT_PAYEE"
  | "PAYEE"
  | "ANNULEE";

export interface InvoiceLine {
  description: string;
  quantite: number;
  prixUnitaire: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId: string | null;
  prescriptionId: string | null;
  dateFacture: string; // YYYY-MM-DD
  dateEcheance: string | null;
  lignes: InvoiceLine[];
  montantTotal: number;
  montantPaye: number;
  montantRestant: number;
  status: InvoiceStatus;
  notes: string | null;
  createdAt: string;
}

export interface InvoicePayload {
  patientId: string;
  appointmentId?: string;
  prescriptionId?: string;
  dateFacture: string;
  dateEcheance?: string;
  lignes: InvoiceLine[];
  notes?: string;
}

export function compterImpayees(invoices: Invoice[]): number {
  return invoices.filter(
    (i) => i.status === "EN_ATTENTE" || i.status === "PARTIELLEMENT_PAYEE",
  ).length;
}

/**
 * Total des montants effectivement encaissés, en excluant les factures annulées —
 * confirmé par InvoiceJpaRepository.totalRevenus() côté backend (WHERE status != 'ANNULEE').
 */
export function calculerTotalRevenus(invoices: Invoice[]): number {
  return invoices
    .filter((inv) => inv.status !== "ANNULEE")
    .reduce((sum, inv) => sum + inv.montantPaye, 0);
}

export interface RevenuMensuel {
  mois: string;
  montant: number;
}

export function compterRevenusParMois(
  invoices: Invoice[],
  nombreMois = 12,
): RevenuMensuel[] {
  const facturesActives = invoices.filter((inv) => inv.status !== "ANNULEE");
  const maintenant = new Date();
  const mois: RevenuMensuel[] = [];

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
    const montant = facturesActives
      .filter((inv) => {
        const factureDate = new Date(inv.dateFacture);
        return (
          factureDate.getFullYear() === date.getFullYear() &&
          factureDate.getMonth() === date.getMonth()
        );
      })
      .reduce((sum, inv) => sum + inv.montantPaye, 0);
    mois.push({ mois: label, montant });
  }

  return mois;
}

export function calculerLigneTotal(
  ligne: Pick<InvoiceLine, "quantite" | "prixUnitaire">,
): number {
  return ligne.quantite * ligne.prixUnitaire;
}

export function calculerTotalLignes(lignes: InvoiceLine[]): number {
  return lignes.reduce((sum, l) => sum + calculerLigneTotal(l), 0);
}

/** Reflète la règle backend : enregistrerPaiement() refuse si ANNULEE ou déjà PAYEE. */
export function peutEnregistrerPaiement(
  invoice: Pick<Invoice, "status">,
): boolean {
  return invoice.status !== "ANNULEE" && invoice.status !== "PAYEE";
}

/** Reflète la règle backend : annuler() refuse uniquement si déjà PAYEE. */
export function peutAnnuler(invoice: Pick<Invoice, "status">): boolean {
  return invoice.status !== "PAYEE";
}
