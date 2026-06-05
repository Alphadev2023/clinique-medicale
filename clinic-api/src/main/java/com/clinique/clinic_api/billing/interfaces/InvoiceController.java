package com.clinique.clinic_api.billing.interfaces;

import com.clinique.clinic_api.billing.application.InvoiceService;
import com.clinique.clinic_api.billing.interfaces.dto.InvoiceRequest;
import com.clinique.clinic_api.billing.interfaces.dto.InvoiceResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import com.clinique.clinic_api.pdf.InvoicePdfService;
import com.clinique.clinic_api.patient.infrastructure.PatientJpaRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/invoices")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoicePdfService    pdfService;
    private final PatientJpaRepository patientRepo;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE')")
    public ResponseEntity<InvoiceResponse> creer(
            @Valid @RequestBody InvoiceRequest req) {
        return ResponseEntity.ok(invoiceService.creer(req));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE')")
    public ResponseEntity<List<InvoiceResponse>> listerToutes() {
        return ResponseEntity.ok(invoiceService.listerToutes());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<InvoiceResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE', 'MEDECIN')")
    public ResponseEntity<List<InvoiceResponse>> parPatient(
            @PathVariable String patientId) {
        return ResponseEntity.ok(invoiceService.parPatient(patientId));
    }

    @GetMapping("/impayees")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE')")
    public ResponseEntity<List<InvoiceResponse>> impayees() {
        return ResponseEntity.ok(invoiceService.facturesImpayees());
    }

    @PatchMapping("/{id}/paiement")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE')")
    public ResponseEntity<InvoiceResponse> paiement(
            @PathVariable String id,
            @RequestParam BigDecimal montant) {
        return ResponseEntity.ok(invoiceService.enregistrerPaiement(id, montant));
    }

    @PatchMapping("/{id}/annuler")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InvoiceResponse> annuler(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.annuler(id));
    }

    @GetMapping("/stats/revenus")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BigDecimal> totalRevenus() {
        return ResponseEntity.ok(invoiceService.totalRevenus());
    }

    @GetMapping("/stats/revenus/mois")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BigDecimal> revenusParMois(
            @RequestParam int mois,
            @RequestParam int annee) {
        return ResponseEntity.ok(invoiceService.revenusParMois(mois, annee));
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETAIRE')")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String id) {
        try {
            var invoice = invoiceService.getEntityById(id);
            String patientNom = patientRepo.findById(invoice.getPatientId())
                    .map(p -> p.getPrenom() + " " + p.getNom())
                    .orElse("Patient inconnu");

            byte[] pdf = pdfService.generateInvoicePdf(invoice, patientNom);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment",
                    "facture_" + id.substring(0, 8) + ".pdf");

            return ResponseEntity.ok().headers(headers).body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}