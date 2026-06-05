package com.clinique.clinic_api.patient.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    private String telephone;

    @Column(nullable = false)
    private LocalDate dateNaissance;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    private String adresse;
    private String numeroSecuriteSociale;

    @Embedded
    private MedicalHistory historiqueMedical;

    @ElementCollection
    @CollectionTable(
            name = "patient_allergies",
            joinColumns = @JoinColumn(name = "patient_id")
    )
    @Builder.Default
    private List<Allergy> allergies = new ArrayList<>();

    @Builder.Default
    @Column(nullable = false)
    private boolean actif = true;

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

    public enum Genre {
        MASCULIN, FEMININ, AUTRE
    }
}