package com.clinique.clinic_api.pdf;

import com.clinique.clinic_api.prescription.domain.Prescription;
import com.clinique.clinic_api.prescription.domain.DrugLine;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.*;
import org.apache.pdfbox.pdmodel.graphics.color.PDColor;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceRGB;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

@Service
public class PrescriptionPdfService {

    private static final float MARGIN     = 50;
    private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT= PDRectangle.A4.getHeight();

    public byte[] generatePrescriptionPdf(Prescription prescription,
                                          String patientNom,
                                          String medecinNom) throws IOException {

        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            PDFont fontBold    = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDFont fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {

                float y = PAGE_HEIGHT - MARGIN;

                // ===== HEADER =====
                // Bande bleue en haut
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                cs.addRect(0, PAGE_HEIGHT - 80, PAGE_WIDTH, 80);
                cs.fill();

                // Titre clinique
                cs.setNonStrokingColor(new PDColor(
                        new float[]{1f, 1f, 1f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 22);
                cs.newLineAtOffset(MARGIN, PAGE_HEIGHT - 45);
                cs.showText("CLINIQUE MEDICALE");
                cs.endText();

                cs.beginText();
                cs.setFont(fontRegular, 11);
                cs.newLineAtOffset(MARGIN, PAGE_HEIGHT - 65);
                cs.showText("Ordonnance Medicale");
                cs.endText();

                y = PAGE_HEIGHT - 100;

                // ===== TITRE ORDONNANCE =====
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.1f, 0.1f, 0.1f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 16);
                cs.newLineAtOffset(MARGIN, y);
                cs.showText("ORDONNANCE");
                cs.endText();

                // Ligne séparatrice
                y -= 10;
                cs.setStrokingColor(new PDColor(
                        new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                cs.setLineWidth(2);
                cs.moveTo(MARGIN, y);
                cs.lineTo(PAGE_WIDTH - MARGIN, y);
                cs.stroke();

                y -= 25;

                // ===== INFOS MÉDECIN / PATIENT =====
                float colLeft  = MARGIN;
                float colRight = PAGE_WIDTH / 2 + 20;

                // Médecin
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 10);
                cs.newLineAtOffset(colLeft, y);
                cs.showText("MEDECIN");
                cs.endText();

                // Patient
                cs.beginText();
                cs.setFont(fontBold, 10);
                cs.newLineAtOffset(colRight, y);
                cs.showText("PATIENT");
                cs.endText();

                y -= 15;

                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.1f, 0.1f, 0.1f}, PDDeviceRGB.INSTANCE));

                // Nom médecin
                cs.beginText();
                cs.setFont(fontBold, 11);
                cs.newLineAtOffset(colLeft, y);
                cs.showText("Dr. " + medecinNom);
                cs.endText();

                // Nom patient
                cs.beginText();
                cs.setFont(fontBold, 11);
                cs.newLineAtOffset(colRight, y);
                cs.showText(patientNom);
                cs.endText();

                y -= 15;

                // Date prescription
                cs.beginText();
                cs.setFont(fontRegular, 10);
                cs.newLineAtOffset(colLeft, y);
                String datePrescription = prescription.getDatePrescription()
                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                cs.showText("Date : " + datePrescription);
                cs.endText();

                // Date expiration
                cs.beginText();
                cs.setFont(fontRegular, 10);
                cs.newLineAtOffset(colRight, y);
                String dateExpiration = prescription.getDateExpiration()
                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                cs.showText("Expire le : " + dateExpiration);
                cs.endText();

                y -= 30;

                // ===== DIAGNOSTIC =====
                if (prescription.getDiagnostic() != null
                        && !prescription.getDiagnostic().isBlank()) {

                    cs.setNonStrokingColor(new PDColor(
                            new float[]{0.95f, 0.97f, 1f}, PDDeviceRGB.INSTANCE));
                    cs.addRect(MARGIN - 5, y - 5,
                            PAGE_WIDTH - 2 * MARGIN + 10, 30);
                    cs.fill();

                    cs.setNonStrokingColor(new PDColor(
                            new float[]{0.1f, 0.1f, 0.1f}, PDDeviceRGB.INSTANCE));
                    cs.beginText();
                    cs.setFont(fontBold, 10);
                    cs.newLineAtOffset(MARGIN, y + 10);
                    cs.showText("Diagnostic : ");
                    cs.endText();

                    cs.beginText();
                    cs.setFont(fontRegular, 10);
                    cs.newLineAtOffset(MARGIN + 70, y + 10);
                    cs.showText(prescription.getDiagnostic());
                    cs.endText();

                    y -= 40;
                }

                // ===== MÉDICAMENTS =====
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontBold, 12);
                cs.newLineAtOffset(MARGIN, y);
                cs.showText("MEDICAMENTS PRESCRITS");
                cs.endText();

                y -= 8;
                cs.setLineWidth(1);
                cs.moveTo(MARGIN, y);
                cs.lineTo(PAGE_WIDTH - MARGIN, y);
                cs.stroke();
                y -= 15;

                int num = 1;
                for (DrugLine drug : prescription.getMedicaments()) {
                    if (y < 100) break;

                    // Fond alternant
                    if (num % 2 == 0) {
                        cs.setNonStrokingColor(new PDColor(
                                new float[]{0.97f, 0.97f, 0.97f}, PDDeviceRGB.INSTANCE));
                        cs.addRect(MARGIN - 5, y - 5,
                                PAGE_WIDTH - 2 * MARGIN + 10, 55);
                        cs.fill();
                    }

                    cs.setNonStrokingColor(new PDColor(
                            new float[]{0.1f, 0.1f, 0.1f}, PDDeviceRGB.INSTANCE));

                    // Numéro + nom médicament
                    cs.beginText();
                    cs.setFont(fontBold, 11);
                    cs.newLineAtOffset(MARGIN, y);
                    cs.showText(num + ". " + drug.getMedicament());
                    cs.endText();

                    // Dosage
                    if (drug.getDosage() != null && !drug.getDosage().isBlank()) {
                        cs.beginText();
                        cs.setFont(fontRegular, 10);
                        cs.newLineAtOffset(MARGIN + 15, y - 14);
                        cs.showText("Dosage : " + drug.getDosage());
                        cs.endText();
                    }

                    // Fréquence + durée
                    cs.beginText();
                    cs.setFont(fontRegular, 10);
                    cs.newLineAtOffset(MARGIN + 15, y - 27);
                    String freqDuree = "";
                    if (drug.getFrequence() != null) freqDuree += drug.getFrequence();
                    if (drug.getDuree() != null) freqDuree += "  —  " + drug.getDuree();
                    cs.showText(freqDuree);
                    cs.endText();

                    // Instructions
                    if (drug.getInstructions() != null
                            && !drug.getInstructions().isBlank()) {
                        cs.beginText();
                        cs.setFont(fontRegular, 9);
                        cs.newLineAtOffset(MARGIN + 15, y - 40);
                        cs.showText("Note : " + drug.getInstructions());
                        cs.endText();
                    }

                    y -= 60;
                    num++;
                }

                // ===== NOTES =====
                if (prescription.getNotes() != null
                        && !prescription.getNotes().isBlank()) {
                    y -= 10;
                    cs.setNonStrokingColor(new PDColor(
                            new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                    cs.beginText();
                    cs.setFont(fontBold, 10);
                    cs.newLineAtOffset(MARGIN, y);
                    cs.showText("NOTES :");
                    cs.endText();

                    y -= 15;
                    cs.setNonStrokingColor(new PDColor(
                            new float[]{0.1f, 0.1f, 0.1f}, PDDeviceRGB.INSTANCE));
                    cs.beginText();
                    cs.setFont(fontRegular, 10);
                    cs.newLineAtOffset(MARGIN, y);
                    cs.showText(prescription.getNotes());
                    cs.endText();
                    y -= 20;
                }

                // ===== SIGNATURE =====
                y = Math.min(y - 30, 150);
                cs.setLineWidth(1);
                cs.setStrokingColor(new PDColor(
                        new float[]{0.7f, 0.7f, 0.7f}, PDDeviceRGB.INSTANCE));
                cs.moveTo(PAGE_WIDTH - MARGIN - 150, y);
                cs.lineTo(PAGE_WIDTH - MARGIN, y);
                cs.stroke();

                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.5f, 0.5f, 0.5f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontRegular, 9);
                cs.newLineAtOffset(PAGE_WIDTH - MARGIN - 150, y - 12);
                cs.showText("Signature du medecin");
                cs.endText();

                // ===== FOOTER =====
                cs.setNonStrokingColor(new PDColor(
                        new float[]{0.15f, 0.39f, 0.92f}, PDDeviceRGB.INSTANCE));
                cs.addRect(0, 0, PAGE_WIDTH, 35);
                cs.fill();

                cs.setNonStrokingColor(new PDColor(
                        new float[]{1f, 1f, 1f}, PDDeviceRGB.INSTANCE));
                cs.beginText();
                cs.setFont(fontRegular, 9);
                cs.newLineAtOffset(MARGIN, 13);
                cs.showText("Document genere electroniquement — Clinique Medicale");
                cs.endText();

                cs.beginText();
                cs.setFont(fontRegular, 9);
                cs.newLineAtOffset(PAGE_WIDTH - MARGIN - 80, 13);
                cs.showText("ID: " + prescription.getId().substring(0, 8));
                cs.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }
}