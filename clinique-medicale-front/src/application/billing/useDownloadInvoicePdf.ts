// src/application/billing/useDownloadInvoicePdf.ts

import { useMutation } from "@tanstack/react-query";
import { billingService } from "../../infrastructure/billingService";
import { downloadBlob } from "../../infrastructure/apiClientBlob";

export function useDownloadInvoicePdf() {
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await billingService.telechargerPdf(id);
      downloadBlob(blob, `facture_${id.slice(0, 8)}.pdf`);
    },
  });
}
