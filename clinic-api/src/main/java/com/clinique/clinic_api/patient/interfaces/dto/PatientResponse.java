// PatientResponse.java
package com.clinique.clinic_api.patient.interfaces.dto;

import com.clinique.clinic_api.patient.domain.Allergy;
import com.clinique.clinic_api.patient.domain.MedicalHistory;
import com.clinique.clinic_api.patient.domain.Patient.Genre;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PatientResponse(
        String id,
        String nom,
        String prenom,
        String email,
        String telephone,
        LocalDate dateNaissance,
        Genre genre,
        String adresse,
        MedicalHistory historiqueMedical,
        List<Allergy> allergies,
        LocalDateTime createdAt
) {}