package com.clinique.clinic_api.patient.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Allergy {
    private String nom;
    private String severite;   // LÉGÈRE, MODÉRÉE, SÉVÈRE
    private String reaction;
}