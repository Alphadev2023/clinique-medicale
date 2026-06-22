// src/main/java/com/clinique/clinic_api/shared/GlobalExceptionHandler.java
// Adapte le package au tien si "shared" n'existe pas chez toi.

package com.clinique.clinic_api.shared;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Erreurs de validation (ex. @Future sur AppointmentRequest.debut) — déjà rencontrées dans cette conversation.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(err -> err.getDefaultMessage())
                .orElse("Données invalides");
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }

    // Données invalides / ressource introuvable (ex. "Email ou mot de passe incorrect", "Patient introuvable").
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }

    // Règle métier violée (ex. conflit de RDV, facture déjà payée) — statut 409 Conflict, plus précis qu'un 400.
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
    }

    // Filet de sécurité : toute autre exception non prévue devient un 500 propre,
    // sans exposer la stack trace ou les détails internes au client.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        ex.printStackTrace();
        Map<String, String> body = new LinkedHashMap<>();
        body.put("message", "Une erreur interne est survenue");
        return ResponseEntity.internalServerError().body(body);
    }
}