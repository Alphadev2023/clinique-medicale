// src/application/billing/billingKeys.ts

export const billingKeys = {
  all: ["invoices"] as const,
  lists: () => [...billingKeys.all, "list"] as const,
  detail: (id: string) => [...billingKeys.all, "detail", id] as const,
  byPatient: (patientId: string) =>
    [...billingKeys.all, "patient", patientId] as const,
  impayees: () => [...billingKeys.all, "impayees"] as const,
  totalRevenus: () => [...billingKeys.all, "total-revenus"] as const,
};
