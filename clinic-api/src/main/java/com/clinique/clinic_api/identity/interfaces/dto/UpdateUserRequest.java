// src/main/java/com/clinique/clinic_api/identity/interfaces/dto/UpdateUserRequest.java

package com.clinique.clinic_api.identity.interfaces.dto;

import com.clinique.clinic_api.identity.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserRequest(
        @NotBlank String nom,
        @NotBlank String prenom,
        @NotBlank @Email String email,
        Role role
) {}