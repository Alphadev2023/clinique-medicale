// src/application/prescriptions/useDownloadPrescriptionPdf.ts

import { useMutation } from "@tanstack/react-query";
import { prescriptionService } from "../../infrastructure/prescriptionService";
import { downloadBlob } from "../../infrastructure/apiClientBlob";

export function useDownloadPrescriptionPdf() {
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await prescriptionService.telechargerPdf(id);
      downloadBlob(blob, `prescription_${id.slice(0, 8)}.pdf`);
    },
  });
}
