package com.clinique.clinic_api.prescription.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String medecinId;

    private String appointmentId;

    @Column(nullable = false)
    private LocalDate datePrescription;

    @Column(nullable = false)
    private LocalDate dateExpiration;

    @ElementCollection
    @CollectionTable(
            name = "prescription_drugs",
            joinColumns = @JoinColumn(name = "prescription_id")
    )
    @Builder.Default
    private List<DrugLine> medicaments = new ArrayList<>();

    private String diagnostic;
    private String notes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PrescriptionStatus status = PrescriptionStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum PrescriptionStatus {
        ACTIVE, EXPIREE, ANNULEE
    }
}