package com.clinique.clinic_api.messaging.interfaces;

import com.clinique.clinic_api.messaging.application.MessageService;
import com.clinique.clinic_api.messaging.interfaces.dto.MessageRequest;
import com.clinique.clinic_api.messaging.interfaces.dto.MessageResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // ===== REST endpoints =====

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<MessageResponse> envoyer(
            @Valid @RequestBody MessageRequest req) {
        return ResponseEntity.ok(messageService.envoyerMessage(req));
    }

    @GetMapping("/conversation")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<List<MessageResponse>> conversation(
            @RequestParam String userId1,
            @RequestParam String userId2) {
        return ResponseEntity.ok(
                messageService.getConversation(userId1, userId2));
    }

    @GetMapping("/non-lus/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<List<MessageResponse>> nonLus(
            @PathVariable String userId) {
        return ResponseEntity.ok(
                messageService.getMessagesNonLus(userId));
    }

    @GetMapping("/notifications/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<List<MessageResponse>> notifications(
            @PathVariable String userId) {
        return ResponseEntity.ok(
                messageService.getNotificationsNonLues(userId));
    }

    @GetMapping("/count-non-lus/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<Long> countNonLus(@PathVariable String userId) {
        return ResponseEntity.ok(messageService.countNonLus(userId));
    }

    @PatchMapping("/{id}/lu")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<Void> marquerLu(@PathVariable String id) {
        messageService.marquerCommeLu(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/tous-lus/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<Void> marquerTousLus(@PathVariable String userId) {
        messageService.marquerTousCommeLus(userId);
        return ResponseEntity.noContent().build();
    }

    // ===== WebSocket endpoint =====
    // Le client envoie vers /app/chat
    // Le message est broadcasté vers /topic/messages
    // ou envoyé en privé vers /user/{id}/queue/messages

    @MessageMapping("/chat")
    public void handleChatMessage(@Payload MessageRequest req) {
        messageService.envoyerMessage(req);
    }
}