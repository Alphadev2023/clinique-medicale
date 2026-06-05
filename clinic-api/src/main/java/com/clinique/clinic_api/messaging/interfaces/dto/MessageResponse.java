// MessageResponse.java
package com.clinique.clinic_api.messaging.interfaces.dto;

import com.clinique.clinic_api.messaging.domain.Message.MessageType;
import java.time.LocalDateTime;

public record MessageResponse(
        String id,
        String expediteurId,
        String expediteurNom,
        String destinataireId,
        String contenu,
        MessageType type,
        boolean lu,
        String imageUrl,
        LocalDateTime createdAt
) {}