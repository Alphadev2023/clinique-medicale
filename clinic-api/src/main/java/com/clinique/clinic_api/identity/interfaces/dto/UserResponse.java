package com.clinique.clinic_api.identity.interfaces.dto;

import com.clinique.clinic_api.identity.domain.Role;

public record UserResponse(
        String id,
        String nom,
        String prenom,
        String email,
        Role role,
        boolean actif
) {}