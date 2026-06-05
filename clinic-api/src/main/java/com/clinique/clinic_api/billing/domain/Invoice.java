package com.clinique.clinic_api.billing.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String patientId;

    private String appointmentId;
    private String prescriptionId;

    @Column(nullable = false)
    private LocalDate dateFacture;

    private LocalDate dateEcheance;

    @ElementCollection
    @CollectionTable(
            name = "invoice_lines",
            joinColumns = @JoinColumn(name = "invoice_id")
    )
    @Builder.Default
    private List<InvoiceLine> lignes = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal montantTotal = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal montantPaye = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.EN_ATTENTE;

    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Calcul automatique du montant total
    public void calculerTotal() {
        this.montantTotal = lignes.stream()
                .map(InvoiceLine::total)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Montant restant à payer
    public BigDecimal montantRestant() {
        return montantTotal.subtract(montantPaye);
    }

    public BigDecimal getMontantRestant() {
        return montantTotal.subtract(montantPaye);
    }

    public enum InvoiceStatus {
        EN_ATTENTE,
        PARTIELLEMENT_PAYEE,
        PAYEE,
        ANNULEE
    }
}