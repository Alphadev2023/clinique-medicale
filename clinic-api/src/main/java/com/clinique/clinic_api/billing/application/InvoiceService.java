package com.clinique.clinic_api.billing.application;

import com.clinique.clinic_api.billing.domain.Invoice;
import com.clinique.clinic_api.billing.domain.Invoice.InvoiceStatus;
import com.clinique.clinic_api.billing.infrastructure.InvoiceJpaRepository;
import com.clinique.clinic_api.billing.interfaces.dto.InvoiceRequest;
import com.clinique.clinic_api.billing.interfaces.dto.InvoiceResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceJpaRepository invoiceRepo;

    @Transactional
    public InvoiceResponse creer(InvoiceRequest req) {
        Invoice invoice = Invoice.builder()
                .patientId(req.patientId())
                .appointmentId(req.appointmentId())
                .prescriptionId(req.prescriptionId())
                .dateFacture(req.dateFacture())
                .dateEcheance(req.dateEcheance())
                .lignes(req.lignes())
                .notes(req.notes())
                .build();

        // Calcul automatique du total
        invoice.calculerTotal();

        return toResponse(invoiceRepo.save(invoice));
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getById(String id) {
        return invoiceRepo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() ->
                        new IllegalArgumentException("Facture introuvable"));
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> listerToutes() {
        return invoiceRepo.findAll()
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> parPatient(String patientId) {
        return invoiceRepo.findByPatientId(patientId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> facturesImpayees() {
        return invoiceRepo.findFacturesImpayees()
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public InvoiceResponse enregistrerPaiement(String id, BigDecimal montant) {
        Invoice invoice = getOrThrow(id);

        if (invoice.getStatus() == InvoiceStatus.ANNULEE) {
            throw new IllegalStateException("Impossible de payer une facture annulée");
        }
        if (invoice.getStatus() == InvoiceStatus.PAYEE) {
            throw new IllegalStateException("Facture déjà entièrement payée");
        }

        BigDecimal nouveauMontantPaye = invoice.getMontantPaye().add(montant);

        // Plafonne au montant total
        if (nouveauMontantPaye.compareTo(invoice.getMontantTotal()) >= 0) {
            invoice.setMontantPaye(invoice.getMontantTotal());
            invoice.setStatus(InvoiceStatus.PAYEE);
        } else {
            invoice.setMontantPaye(nouveauMontantPaye);
            invoice.setStatus(InvoiceStatus.PARTIELLEMENT_PAYEE);
        }

        return toResponse(invoiceRepo.save(invoice));
    }

    @Transactional
    public InvoiceResponse annuler(String id) {
        Invoice invoice = getOrThrow(id);
        if (invoice.getStatus() == InvoiceStatus.PAYEE) {
            throw new IllegalStateException(
                    "Impossible d'annuler une facture déjà payée");
        }
        invoice.setStatus(InvoiceStatus.ANNULEE);
        return toResponse(invoiceRepo.save(invoice));
    }

    @Transactional(readOnly = true)
    public BigDecimal totalRevenus() {
        return invoiceRepo.totalRevenus();
    }

    @Transactional(readOnly = true)
    public BigDecimal revenusParMois(int mois, int annee) {
        return invoiceRepo.revenusParMois(mois, annee);
    }

    private Invoice getOrThrow(String id) {
        return invoiceRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Facture introuvable"));
    }

    private InvoiceResponse toResponse(Invoice i) {
        return new InvoiceResponse(
                i.getId(), i.getPatientId(),
                i.getAppointmentId(), i.getPrescriptionId(),
                i.getDateFacture(), i.getDateEcheance(),
                i.getLignes(), i.getMontantTotal(),
                i.getMontantPaye(), i.montantRestant(),
                i.getStatus(), i.getNotes(),
                i.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public Invoice getEntityById(String id) {
        return invoiceRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable"));
    }
}