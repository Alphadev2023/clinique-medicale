// PatientRequest.java
package com.clinique.clinic_api.patient.interfaces.dto;

import com.clinique.clinic_api.patient.domain.Allergy;
import com.clinique.clinic_api.patient.domain.MedicalHistory;
import com.clinique.clinic_api.patient.domain.Patient.Genre;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public record PatientRequest(
        @NotBlank String nom,
        @NotBlank String prenom,
        @Email @NotBlank String email,
        String telephone,
        @NotNull LocalDate dateNaissance,
        Genre genre,
        String adresse,
        String numeroSecuriteSociale,
        MedicalHistory historiqueMedical,
        List<Allergy> allergies
) {}