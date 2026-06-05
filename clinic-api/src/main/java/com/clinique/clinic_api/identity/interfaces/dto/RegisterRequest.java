// RegisterRequest.java
package com.clinique.clinic_api.identity.interfaces.dto;
import com.clinique.clinic_api.identity.domain.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6) String password,
        @NotBlank String nom,
        @NotBlank String prenom,
        @NotNull Role role
) {}