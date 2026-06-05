package com.clinique.clinic_api.pdf;

import com.clinique.clinic_api.billing.domain.Invoice;
import com.clinique.clinic_api.billing.domain.InvoiceLine;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.*;
import org.apache.pdfbox.pdmodel.graphics.color.PDColor;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceRGB;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

@Service
public class InvoicePdfService {

    private static final float MARGIN      = 50;
    private static final float PAGE_WIDTH  = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();

    public byte[] generateInvoicePdf(Invoice invoice,
                                     String patientNom) throws IOException {

        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            PDFont fontBold    = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDFont fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            NumberFormat nf = NumberFormat.getInstance(Locale.FRANCE);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {

                float y = PAGE_HEIGHT - MARGIN;

                // ===== HEADER =====
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.1f, 0.1f, 0.1f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 24);
                cs.newLineAtOffset(MARGIN, y);
                cs.showText("CLINIQUE MEDICALE");
                cs.endText();

                // FACTURE à droite
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 28);
                cs.newLineAtOffset(PAGE_WIDTH - MARGIN - 120, y);
                cs.showText("FACTURE");
                cs.endText();

                y -= 20;
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.5f, 0.5f, 0.5f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontRegular, 10);
                cs.newLineAtOffset(MARGIN, y);
                cs.showText("Yaounde, Cameroun");
                cs.endText();

                // N° facture
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.5f, 0.5f, 0.5f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontRegular, 10);
                cs.newLineAtOffset(PAGE_WIDTH - MARGIN - 120, y);
                cs.showText("N° " + invoice.getId().substring(0, 8).toUpperCase());
                cs.endText();

                y -= 30;

                // Ligne séparatrice
                cs.setStrokingColor(new PDColor(
                        new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                cs.setLineWidth(2);
                cs.moveTo(MARGIN, y);
                cs.lineTo(PAGE_WIDTH - MARGIN, y);
                cs.stroke();

                y -= 25;

                // ===== INFOS PATIENT / DATES =====
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.5f, 0.5f, 0.5f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 9);
                cs.newLineAtOffset(MARGIN, y);
                cs.showText("FACTURE A");
                cs.endText();

                cs.beginText();
                cs.setFont(fontBold, 9);
                cs.newLineAtOffset(PAGE_WIDTH - MARGIN - 150, y);
                cs.showText("DETAILS");
                cs.endText();

                y -= 15;
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.1f, 0.1f, 0.1f}, PDDeviceRGB.INSTANCE));

                cs.beginText();
                cs.setFont(fontBold, 12);
                cs.newLineAtOffset(MARGIN, y);
                cs.showText(patientNom);
                cs.endText();

                String dateFacture = invoice.getDateFacture()
                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                cs.beginText();
                cs.setFont(fontRegular, 10);
                cs.newLineAtOffset(PAGE_WIDTH - MARGIN - 150, y);
                cs.showText("Date : " + dateFacture);
                cs.endText();

                if (invoice.getDateEcheance() != null) {
                    y -= 15;
                    String dateEch = invoice.getDateEcheance()
                            .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                    cs.beginText();
                    cs.setFont(fontRegular, 10);
                    cs.newLineAtOffset(PAGE_WIDTH - MARGIN - 150, y);
                    cs.showText("Echeance : " + dateEch);
                    cs.endText();
                }

                y -= 35;

                // ===== TABLEAU LIGNES =====
                float tableWidth = PAGE_WIDTH - 2 * MARGIN;
                float col1 = MARGIN;
                float col2 = MARGIN + tableWidth * 0.5f;
                float col3 = MARGIN + tableWidth * 0.65f;
                float col4 = MARGIN + tableWidth * 0.80f;

                // En-tête tableau
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                cs.addRect(MARGIN, y - 5, tableWidth, 22);
                cs.fill();

                cs.setNonStrokingColor(new PDColor(
                        new float[]{1f, 1f, 1f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 10);
                cs.newLineAtOffset(col1 + 5, y + 5);
                cs.showText("DESCRIPTION");
                cs.endText();

                cs.beginText();
                cs.setFont(fontBold, 10);
                cs.newLineAtOffset(col2, y + 5);
                cs.showText("QTE");
                cs.endText();

                cs.beginText();
                cs.setFont(fontBold, 10);
                cs.newLineAtOffset(col3, y + 5);
                cs.showText("PRIX UNIT.");
                cs.endText();

                cs.beginText();
                cs.setFont(fontBold, 10);
                cs.newLineAtOffset(col4, y + 5);
                cs.showText("TOTAL");
                cs.endText();

                y -= 25;

                // Lignes du tableau
                int row = 0;
                for (InvoiceLine ligne : invoice.getLignes()) {
                    if (y < 100) break;

                    if (row % 2 == 0) {
                        cs.setNonStrokingColor(new PDColor(
                                new float[]{0.97f, 0.97f, 0.97f}, PDDeviceRGB.INSTANCE));
                        cs.addRect(MARGIN, y - 5, tableWidth, 20);
                        cs.fill();
                    }

                    cs.setNonStrokingColor(new PDColor(
                            new float[]{0.1f, 0.1f, 0.1f}, PDDeviceRGB.INSTANCE));

                    cs.beginText();
                    cs.setFont(fontRegular, 10);
                    cs.newLineAtOffset(col1 + 5, y + 3);
                    cs.showText(ligne.getDescription() != null
                            ? ligne.getDescription() : "");
                    cs.endText();

                    cs.beginText();
                    cs.setFont(fontRegular, 10);
                    cs.newLineAtOffset(col2, y + 3);
                    cs.showText(String.valueOf(ligne.getQuantite()));
                    cs.endText();

                    cs.beginText();
                    cs.setFont(fontRegular, 10);
                    cs.newLineAtOffset(col3, y + 3);
                    cs.showText(nf.format(ligne.getPrixUnitaire()) + " F");
                    cs.endText();

                    BigDecimal total = ligne.getPrixUnitaire()
                            .multiply(BigDecimal.valueOf(ligne.getQuantite()));
                    cs.beginText();
                    cs.setFont(fontBold, 10);
                    cs.newLineAtOffset(col4, y + 3);
                    cs.showText(nf.format(total) + " F");
                    cs.endText();

                    y -= 22;
                    row++;
                }

                // ===== TOTAUX =====
                y -= 10;
                cs.setLineWidth(1);
                cs.setStrokingColor(new PDColor(
                        new float[]{0.8f, 0.8f, 0.8f}, PDDeviceRGB.INSTANCE));
                cs.moveTo(col3, y);
                cs.lineTo(PAGE_WIDTH - MARGIN, y);
                cs.stroke();

                y -= 15;
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.3f, 0.3f, 0.3f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontRegular, 10);
                cs.newLineAtOffset(col3, y);
                cs.showText("Sous-total :");
                cs.endText();
                cs.beginText();
                cs.setFont(fontRegular, 10);
                cs.newLineAtOffset(col4, y);
                cs.showText(nf.format(invoice.getMontantTotal().subtract(invoice.getMontantPaye())) + " F");
                cs.endText();

                y -= 15;
                cs.beginText();
                cs.setFont(fontRegular, 10);
                cs.newLineAtOffset(col3, y);
                cs.showText("Deja paye :");
                cs.endText();
                cs.beginText();
                cs.setFont(fontRegular, 10);
                cs.newLineAtOffset(col4, y);
                cs.showText(nf.format(invoice.getMontantTotal().subtract(invoice.getMontantPaye())) + " F");
                cs.endText();

                y -= 5;
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                cs.addRect(col3 - 5, y - 8, PAGE_WIDTH - MARGIN - col3 + 5, 22);
                cs.fill();

                cs.setNonStrokingColor(new PDColor(
                        new float[]{1f, 1f, 1f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 11);
                cs.newLineAtOffset(col3, y);
                cs.showText("RESTANT :");
                cs.endText();
                cs.beginText();
                cs.setFont(fontBold, 11);
                cs.newLineAtOffset(col4, y);
                cs.showText(nf.format(invoice.getMontantRestant()) + " F");
                cs.endText();

                // ===== STATUT =====
                y -= 40;
                String statut = invoice.getStatus().name();
                float[] color = switch (statut) {
                    case "PAYEE"               -> new float[]{0.05f, 0.6f, 0.4f};
                    case "PARTIELLEMENT_PAYEE" -> new float[]{0.9f, 0.6f, 0.1f};
                    case "ANNULEE"             -> new float[]{0.8f, 0.1f, 0.1f};
                    default                    -> new float[]{0.15f, 0.39f, 0.92f};
                };

                cs.setNonStrokingColor(new PDColor(color, PDDeviceRGB.INSTANCE));
                cs.addRect(MARGIN, y - 5, 120, 22);
                cs.fill();

                cs.setNonStrokingColor(new PDColor(
                        new float[]{1f, 1f, 1f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 11);
                cs.newLineAtOffset(MARGIN + 10, y + 5);
                cs.showText(statut.replace("_", " "));
                cs.endText();

                // ===== NOTES =====
                if (invoice.getNotes() != null && !invoice.getNotes().isBlank()) {
                    y -= 35;
                    cs.setNonStrokingColor(new PDColor(
                            new float[]{0.3f, 0.3f, 0.3f}, PDDeviceRGB.INSTANCE));
                    cs.beginText();
                    cs.setFont(fontBold, 9);
                    cs.newLineAtOffset(MARGIN, y);
                    cs.showText("NOTES : ");
                    cs.endText();
                    cs.beginText();
                    cs.setFont(fontRegular, 9);
                    cs.newLineAtOffset(MARGIN + 45, y);
                    cs.showText(invoice.getNotes());
                    cs.endText();
                }

                // ===== FOOTER =====
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.97f, 0.97f, 0.97f}, PDDeviceRGB.INSTANCE));
                cs.addRect(0, 0, PAGE_WIDTH, 40);
                cs.fill();

                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.5f, 0.5f, 0.5f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontRegular, 8);
                cs.newLineAtOffset(MARGIN, 20);
                cs.showText("Clinique Medicale — Document genere electroniquement");
                cs.endText();

                cs.beginText();
                cs.setFont(fontRegular, 8);
                cs.newLineAtOffset(PAGE_WIDTH - MARGIN - 100, 20);
                cs.showText("Ref: " + invoice.getId().substring(0, 8).toUpperCase());
                cs.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }
}