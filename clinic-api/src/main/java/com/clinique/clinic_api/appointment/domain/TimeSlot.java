package com.clinique.clinic_api.appointment.domain;

import jakarta.persistence.Embeddable;
import lombok.*;
import java.time.LocalDateTime;

@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlot {

    private LocalDateTime debut;
    private LocalDateTime fin;

    public boolean chevauchePeriode(LocalDateTime autreDebut, LocalDateTime autreFin) {
        return this.debut.isBefore(autreFin) && this.fin.isAfter(autreDebut);
    }
}