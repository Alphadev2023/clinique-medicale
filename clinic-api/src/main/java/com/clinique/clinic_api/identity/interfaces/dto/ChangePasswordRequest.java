// ChangePasswordRequest.java
package com.clinique.clinic_api.identity.interfaces.dto;

public record ChangePasswordRequest(
        String ancienMotDePasse,
        String nouveauMotDePasse
) {}