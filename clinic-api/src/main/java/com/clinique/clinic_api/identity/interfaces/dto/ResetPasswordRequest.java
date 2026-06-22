// src/main/java/com/clinique/clinic_api/identity/interfaces/dto/ResetPasswordRequest.java

package com.clinique.clinic_api.identity.interfaces.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères") String nouveauMotDePasse
) {}