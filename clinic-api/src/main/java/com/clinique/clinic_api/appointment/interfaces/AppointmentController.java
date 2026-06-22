package com.clinique.clinic_api.appointment.interfaces;

import com.clinique.clinic_api.appointment.application.AppointmentService;
import com.clinique.clinic_api.appointment.interfaces.dto.AppointmentRequest;
import com.clinique.clinic_api.appointment.interfaces.dto.AppointmentResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")  // ← ajoute MEDECIN
    public ResponseEntity<?> creer(@Valid @RequestBody AppointmentRequest req) {
        try {
            return ResponseEntity.ok(appointmentService.creerRdv(req));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<List<AppointmentResponse>> listerTous() {
        return ResponseEntity.ok(appointmentService.listerTous());
    }

    @GetMapping("/medecin/{medecinId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<List<AppointmentResponse>> parMedecin(
            @PathVariable String medecinId) {
        return ResponseEntity.ok(appointmentService.listerParMedecin(medecinId));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<List<AppointmentResponse>> parPatient(
            @PathVariable String patientId) {
        return ResponseEntity.ok(appointmentService.listerParPatient(patientId));
    }

    @GetMapping("/periode")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<List<AppointmentResponse>> parPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime fin) {
        return ResponseEntity.ok(appointmentService.listerParPeriode(debut, fin));
    }

    @PatchMapping("/{id}/confirmer")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")  // ← ajoute MEDECIN
    public ResponseEntity<AppointmentResponse> confirmer(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.confirmer(id));
    }

    @PatchMapping("/{id}/annuler")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")  // ← ajoute MEDECIN
    public ResponseEntity<AppointmentResponse> annuler(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.annuler(id));
    }

    @PatchMapping("/{id}/terminer")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")  // ← ajoute SECRETAIRE
    public ResponseEntity<AppointmentResponse> terminer(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.terminer(id));
    }
}