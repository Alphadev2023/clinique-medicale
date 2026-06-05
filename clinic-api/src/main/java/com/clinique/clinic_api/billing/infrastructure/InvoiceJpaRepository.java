package com.clinique.clinic_api.billing.infrastructure;

import com.clinique.clinic_api.billing.domain.Invoice;
import com.clinique.clinic_api.billing.domain.Invoice.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface InvoiceJpaRepository extends JpaRepository<Invoice, String> {

    List<Invoice> findByPatientId(String patientId);

    List<Invoice> findByStatus(InvoiceStatus status);

    List<Invoice> findByPatientIdAndStatus(String patientId, InvoiceStatus status);

    // Total des revenus encaissés
    @Query("SELECT COALESCE(SUM(i.montantPaye), 0) FROM Invoice i " +
            "WHERE i.status != 'ANNULEE'")
    BigDecimal totalRevenus();

    // Factures impayées
    @Query("SELECT i FROM Invoice i WHERE " +
            "i.status IN ('EN_ATTENTE', 'PARTIELLEMENT_PAYEE')")
    List<Invoice> findFacturesImpayees();

    // Revenus du mois
    @Query("SELECT COALESCE(SUM(i.montantPaye), 0) FROM Invoice i " +
            "WHERE MONTH(i.dateFacture) = :mois " +
            "AND YEAR(i.dateFacture) = :annee " +
            "AND i.status != 'ANNULEE'")
    BigDecimal revenusParMois(
            @Param("mois") int mois,
            @Param("annee") int annee
    );
}