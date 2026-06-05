package com.clinique.clinic_api.prescription.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrugLine {
    private String medicament;
    private String dosage;
    private String frequence;
    private String duree;
    private String instructions;
}