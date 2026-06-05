// MessageRequest.java
package com.clinique.clinic_api.messaging.interfaces.dto;

import com.clinique.clinic_api.messaging.domain.Message.MessageType;
import jakarta.validation.constraints.NotBlank;

public record MessageRequest(
        @NotBlank String expediteurId,
        @NotBlank String expediteurNom,
        String destinataireId,
        String contenu,
        MessageType type,
        String imageUrl
) {}