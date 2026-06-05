package com.clinique.clinic_api.prescription.application;

import com.clinique.clinic_api.prescription.domain.Prescription;
import com.clinique.clinic_api.prescription.domain.Prescription.PrescriptionStatus;
import com.clinique.clinic_api.prescription.infrastructure.PrescriptionJpaRepository;
import com.clinique.clinic_api.prescription.interfaces.dto.PrescriptionRequest;
import com.clinique.clinic_api.prescription.interfaces.dto.PrescriptionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionJpaRepository prescriptionRepo;

    @Transactional
    public PrescriptionResponse creer(PrescriptionRequest req) {
        Prescription prescription = Prescription.builder()
                .patientId(req.patientId())
                .medecinId(req.medecinId())
                .appointmentId(
                        (req.appointmentId() != null && !req.appointmentId().isBlank())
                                ? req.appointmentId() : null
                )
                .datePrescription(req.datePrescription())
                .dateExpiration(req.dateExpiration())
                .medicaments(req.medicaments())
                .diagnostic(req.diagnostic())
                .notes(req.notes())
                .build();
        return toResponse(prescriptionRepo.save(prescription));
    }

    @Transactional(readOnly = true)
    public PrescriptionResponse getById(String id) {
        return prescriptionRepo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() ->
                        new IllegalArgumentException("Prescription introuvable"));
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> parPatient(String patientId) {
        return prescriptionRepo.findByPatientId(patientId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> parPatientActives(String patientId) {
        return prescriptionRepo
                .findByPatientIdAndStatus(patientId, PrescriptionStatus.ACTIVE)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> parMedecin(String medecinId) {
        return prescriptionRepo.findByMedecinId(medecinId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> parAppointment(String appointmentId) {
        return prescriptionRepo.findByAppointmentId(appointmentId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public PrescriptionResponse annuler(String id) {
        Prescription p = getOrThrow(id);
        p.setStatus(PrescriptionStatus.ANNULEE);
        return toResponse(prescriptionRepo.save(p));
    }

    @Transactional
    public void verifierExpirations() {
        prescriptionRepo.findAll().stream()
                .filter(p -> p.getStatus() == PrescriptionStatus.ACTIVE)
                .filter(p -> p.getDateExpiration()
                        .isBefore(java.time.LocalDate.now()))
                .forEach(p -> {
                    p.setStatus(PrescriptionStatus.EXPIREE);
                    prescriptionRepo.save(p);
                });
    }

    private Prescription getOrThrow(String id) {
        return prescriptionRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Prescription introuvable"));
    }

    private PrescriptionResponse toResponse(Prescription p) {
        return new PrescriptionResponse(
                p.getId(), p.getPatientId(), p.getMedecinId(),
                p.getAppointmentId(), p.getDatePrescription(),
                p.getDateExpiration(), p.getMedicaments(),
                p.getDiagnostic(), p.getNotes(),
                p.getStatus(), p.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public Prescription getEntityById(String id) {
        return prescriptionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription introuvable"));
    }
}