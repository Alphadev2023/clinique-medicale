// AuthResponse.java
package com.clinique.clinic_api.identity.interfaces.dto;

public record AuthResponse(
        String token,
        String role,
        String nom,
        String id
) {}