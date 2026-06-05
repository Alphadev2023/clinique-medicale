// PrescriptionResponse.java
package com.clinique.clinic_api.prescription.interfaces.dto;

import com.clinique.clinic_api.prescription.domain.DrugLine;
import com.clinique.clinic_api.prescription.domain.Prescription.PrescriptionStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PrescriptionResponse(
        String id,
        String patientId,
        String medecinId,
        String appointmentId,
        LocalDate datePrescription,
        LocalDate dateExpiration,
        List<DrugLine> medicaments,
        String diagnostic,
        String notes,
        PrescriptionStatus status,
        LocalDateTime createdAt
) {}