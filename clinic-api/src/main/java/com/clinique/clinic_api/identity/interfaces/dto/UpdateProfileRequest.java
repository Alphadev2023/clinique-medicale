// UpdateProfileRequest.java
package com.clinique.clinic_api.identity.interfaces.dto;

public record UpdateProfileRequest(
        String nom,
        String prenom
) {}