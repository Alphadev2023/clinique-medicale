package com.clinique.clinic_api.patient.interfaces;

import com.clinique.clinic_api.patient.application.PatientService;
import com.clinique.clinic_api.patient.interfaces.dto.PatientRequest;
import com.clinique.clinic_api.patient.interfaces.dto.PatientResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<PatientResponse> creer(@Valid @RequestBody PatientRequest req) {
        return ResponseEntity.ok(patientService.creerPatient(req));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<List<PatientResponse>> lister() {
        return ResponseEntity.ok(patientService.listerPatients());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<PatientResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(patientService.getPatient(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN')")
    public ResponseEntity<PatientResponse> modifier(
            @PathVariable String id,
            @Valid @RequestBody PatientRequest req) {
        return ResponseEntity.ok(patientService.modifierPatient(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> supprimer(@PathVariable String id) {
        patientService.supprimerPatient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<List<PatientResponse>> rechercher(@RequestParam String q) {
        return ResponseEntity.ok(patientService.rechercherPatients(q));
    }
}