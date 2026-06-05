// AppointmentResponse.java
package com.clinique.clinic_api.appointment.interfaces.dto;

import com.clinique.clinic_api.appointment.domain.AppointmentStatus;
import java.time.LocalDateTime;

public record AppointmentResponse(
        String id,
        String patientId,
        String medecinId,
        LocalDateTime debut,
        LocalDateTime fin,
        String motif,
        String salle,
        String notes,
        AppointmentStatus status,
        LocalDateTime createdAt
) {}