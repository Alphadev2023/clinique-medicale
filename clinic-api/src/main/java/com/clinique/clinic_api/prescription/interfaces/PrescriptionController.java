package com.clinique.clinic_api.prescription.interfaces;

import com.clinique.clinic_api.prescription.application.PrescriptionService;
import com.clinique.clinic_api.prescription.interfaces.dto.PrescriptionRequest;
import com.clinique.clinic_api.prescription.interfaces.dto.PrescriptionResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.clinique.clinic_api.pdf.PrescriptionPdfService;
import com.clinique.clinic_api.patient.infrastructure.PatientJpaRepository;
import com.clinique.clinic_api.identity.infrastructure.UserJpaRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/prescriptions")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final PrescriptionPdfService pdfService;
    private final PatientJpaRepository   patientRepo;
    private final UserJpaRepository      userRepo;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN')")
    public ResponseEntity<PrescriptionResponse> creer(
            @Valid @RequestBody PrescriptionRequest req) {
        return ResponseEntity.ok(prescriptionService.creer(req));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<PrescriptionResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(prescriptionService.getById(id));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<List<PrescriptionResponse>> parPatient(
            @PathVariable String patientId) {
        return ResponseEntity.ok(prescriptionService.parPatient(patientId));
    }

    @GetMapping("/patient/{patientId}/actives")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<List<PrescriptionResponse>> parPatientActives(
            @PathVariable String patientId) {
        return ResponseEntity.ok(prescriptionService.parPatientActives(patientId));
    }

    @GetMapping("/medecin/{medecinId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN')")
    public ResponseEntity<List<PrescriptionResponse>> parMedecin(
            @PathVariable String medecinId) {
        return ResponseEntity.ok(prescriptionService.parMedecin(medecinId));
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN', 'SECRETAIRE')")
    public ResponseEntity<List<PrescriptionResponse>> parAppointment(
            @PathVariable String appointmentId) {
        return ResponseEntity.ok(prescriptionService.parAppointment(appointmentId));
    }

    @PatchMapping("/{id}/annuler")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN')")
    public ResponseEntity<PrescriptionResponse> annuler(@PathVariable String id) {
        return ResponseEntity.ok(prescriptionService.annuler(id));
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEDECIN')")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String id) {
        try {
            var prescription = prescriptionService.getEntityById(id);
            String patientNom = patientRepo.findById(prescription.getPatientId())
                    .map(p -> p.getPrenom() + " " + p.getNom())
                    .orElse("Patient inconnu");
            String medecinNom = userRepo.findById(prescription.getMedecinId())
                    .map(u -> u.getPrenom() + " " + u.getNom())
                    .orElse("Medecin inconnu");

            byte[] pdf = pdfService.generatePrescriptionPdf(
                    prescription, patientNom, medecinNom
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment",
                    "prescription_" + id.substring(0, 8) + ".pdf");

            return ResponseEntity.ok().headers(headers).body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}