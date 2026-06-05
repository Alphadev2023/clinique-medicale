package com.clinique.clinic_api.billing;

import com.clinique.clinic_api.billing.application.InvoiceService;
import com.clinique.clinic_api.billing.domain.Invoice;
import com.clinique.clinic_api.billing.domain.Invoice.InvoiceStatus;
import com.clinique.clinic_api.billing.infrastructure.InvoiceJpaRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests InvoiceService")
class InvoiceServiceTest {

    @Mock private InvoiceJpaRepository invoiceRepo;
    @InjectMocks private InvoiceService invoiceService;

    private Invoice testInvoice;

    @BeforeEach
    void setUp() {
        testInvoice = Invoice.builder()
                .id("invoice-123")
                .patientId("patient-123")
                .dateFacture(LocalDate.now())
                .montantTotal(BigDecimal.valueOf(50000))
                .montantPaye(BigDecimal.ZERO)
                .status(InvoiceStatus.EN_ATTENTE)
                .lignes(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("Enregistrer un paiement partiel")
    void paiement_partiel() {
        when(invoiceRepo.findById("invoice-123"))
                .thenReturn(Optional.of(testInvoice));
        when(invoiceRepo.save(any())).thenReturn(testInvoice);

        invoiceService.enregistrerPaiement("invoice-123",
                BigDecimal.valueOf(20000));

        assertThat(testInvoice.getMontantPaye())
                .isEqualByComparingTo(BigDecimal.valueOf(20000));
        assertThat(testInvoice.getStatus())
                .isEqualTo(InvoiceStatus.PARTIELLEMENT_PAYEE);
    }

    @Test
    @DisplayName("Enregistrer un paiement complet")
    void paiement_complet() {
        when(invoiceRepo.findById("invoice-123"))
                .thenReturn(Optional.of(testInvoice));
        when(invoiceRepo.save(any())).thenReturn(testInvoice);

        invoiceService.enregistrerPaiement("invoice-123",
                BigDecimal.valueOf(50000));

        assertThat(testInvoice.getMontantPaye())
                .isEqualByComparingTo(BigDecimal.valueOf(50000));
        assertThat(testInvoice.getStatus())
                .isEqualTo(InvoiceStatus.PAYEE);
    }

    @Test
    @DisplayName("Impossible de payer une facture annulée")
    void paiement_facture_annulee() {
        testInvoice.setStatus(InvoiceStatus.ANNULEE);
        when(invoiceRepo.findById("invoice-123"))
                .thenReturn(Optional.of(testInvoice));

        assertThatThrownBy(() ->
                invoiceService.enregistrerPaiement("invoice-123",
                        BigDecimal.valueOf(1000)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("annulée");
    }

    @Test
    @DisplayName("Annuler une facture non payée")
    void annuler_success() {
        when(invoiceRepo.findById("invoice-123"))
                .thenReturn(Optional.of(testInvoice));
        when(invoiceRepo.save(any())).thenReturn(testInvoice);

        invoiceService.annuler("invoice-123");

        assertThat(testInvoice.getStatus())
                .isEqualTo(InvoiceStatus.ANNULEE);
    }

    @Test
    @DisplayName("Annuler une facture déjà payée lance une exception")
    void annuler_facture_payee() {
        testInvoice.setStatus(InvoiceStatus.PAYEE);
        when(invoiceRepo.findById("invoice-123"))
                .thenReturn(Optional.of(testInvoice));

        assertThatThrownBy(() -> invoiceService.annuler("invoice-123"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("déjà payée");
    }

    @Test
    @DisplayName("Facture introuvable lance une exception")
    void paiement_notFound() {
        when(invoiceRepo.findById("inconnu"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                invoiceService.enregistrerPaiement("inconnu",
                        BigDecimal.valueOf(1000)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Facture introuvable");
    }
}