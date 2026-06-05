// InvoiceRequest.java
package com.clinique.clinic_api.billing.interfaces.dto;

import com.clinique.clinic_api.billing.domain.InvoiceLine;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record InvoiceRequest(
        @NotBlank String patientId,
        String appointmentId,
        String prescriptionId,
        @NotNull LocalDate dateFacture,
        LocalDate dateEcheance,
        @NotEmpty List<InvoiceLine> lignes,
        String notes
) {}