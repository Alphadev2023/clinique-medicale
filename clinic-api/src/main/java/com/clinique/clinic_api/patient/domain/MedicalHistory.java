package com.clinique.clinic_api.patient.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistory {
    private String antecedents;
    private String maladiesChroniques;
    private String chirurgies;
    private String traitementsEnCours;
}