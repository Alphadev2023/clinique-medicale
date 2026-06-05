// AppointmentRequest.java
package com.clinique.clinic_api.appointment.interfaces.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record AppointmentRequest(
        @NotBlank String patientId,
        @NotBlank String medecinId,
        @NotNull @Future LocalDateTime debut,
        @NotNull LocalDateTime fin,
        String motif,
        String salle,
        String notes
) {}