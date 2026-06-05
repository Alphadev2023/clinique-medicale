// PrescriptionRequest.java
package com.clinique.clinic_api.prescription.interfaces.dto;

import com.clinique.clinic_api.prescription.domain.DrugLine;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record PrescriptionRequest(
        @NotBlank String patientId,
        @NotBlank String medecinId,
        String appointmentId,
        @NotNull LocalDate datePrescription,
        @NotNull LocalDate dateExpiration,
        @NotEmpty List<DrugLine> medicaments,
        String diagnostic,
        String notes
) {}