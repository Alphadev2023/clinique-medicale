package com.clinique.clinic_api.messaging.interfaces;

import com.clinique.clinic_api.messaging.application.MessageService;
import com.clinique.clinic_api.messaging.domain.Message.MessageType;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class NotificationController {

    private final MessageService messageService;

    @PostMapping("/rdv")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE')")
    public ResponseEntity<Void> notifierNouveauRdv(
            @RequestParam String destinataireId,
            @RequestParam String message) {
        messageService.envoyerNotification(
                destinataireId, message, MessageType.NOTIFICATION);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rappel")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE')")
    public ResponseEntity<Void> envoyerRappel(
            @RequestParam String destinataireId,
            @RequestParam String message) {
        messageService.envoyerNotification(
                destinataireId, message, MessageType.RAPPEL);
        return ResponseEntity.ok().build();
    }
}