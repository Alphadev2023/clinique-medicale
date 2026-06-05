// InvoiceResponse.java
package com.clinique.clinic_api.billing.interfaces.dto;

import com.clinique.clinic_api.billing.domain.Invoice.InvoiceStatus;
import com.clinique.clinic_api.billing.domain.InvoiceLine;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record InvoiceResponse(
        String id,
        String patientId,
        String appointmentId,
        String prescriptionId,
        LocalDate dateFacture,
        LocalDate dateEcheance,
        List<InvoiceLine> lignes,
        BigDecimal montantTotal,
        BigDecimal montantPaye,
        BigDecimal montantRestant,
        InvoiceStatus status,
        String notes,
        LocalDateTime createdAt
) {}