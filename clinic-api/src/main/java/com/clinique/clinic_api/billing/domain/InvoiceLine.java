package com.clinique.clinic_api.billing.domain;

import jakarta.persistence.Embeddable;
import lombok.*;
import java.math.BigDecimal;

@Embeddable
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceLine {
    private String description;
    private Integer quantite;
    private BigDecimal prixUnitaire;

    public BigDecimal total() {
        return prixUnitaire.multiply(BigDecimal.valueOf(quantite));
    }
}