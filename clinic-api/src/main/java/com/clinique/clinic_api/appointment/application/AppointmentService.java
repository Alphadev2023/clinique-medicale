package com.clinique.clinic_api.appointment.application;

import com.clinique.clinic_api.appointment.domain.Appointment;
import com.clinique.clinic_api.appointment.domain.AppointmentStatus;
import com.clinique.clinic_api.appointment.domain.TimeSlot;
import com.clinique.clinic_api.appointment.infrastructure.AppointmentJpaRepository;
import com.clinique.clinic_api.appointment.interfaces.dto.AppointmentRequest;
import com.clinique.clinic_api.appointment.interfaces.dto.AppointmentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentJpaRepository appointmentRepo;

    @Transactional
    public AppointmentResponse creerRdv(AppointmentRequest req) {

        // Règle 1 — médecin déjà occupé sur ce créneau
        if (appointmentRepo.existsConflitMedecin(
                req.medecinId(), req.debut(), req.fin())) {
            throw new IllegalStateException(
                    "Le médecin a déjà un rendez-vous sur ce créneau");
        }

        // Règle 2 — patient a déjà un RDV ce jour-là
        if (appointmentRepo.existsConflitPatientMemeJour(
                req.patientId(), req.debut())) {
            throw new IllegalStateException(
                    "Le patient a déjà un rendez-vous ce jour-là");
        }

        Appointment rdv = Appointment.builder()
                .patientId(req.patientId())
                .medecinId(req.medecinId())
                .timeSlot(new TimeSlot(req.debut(), req.fin()))
                .motif(req.motif())
                .salle(req.salle())
                .notes(req.notes())
                .build();

        return toResponse(appointmentRepo.save(rdv));
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> listerTous() {
        return appointmentRepo.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> listerParMedecin(String medecinId) {
        return appointmentRepo
                .findByMedecinIdAndStatusNot(medecinId, AppointmentStatus.ANNULE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> listerParPatient(String patientId) {
        return appointmentRepo
                .findByPatientIdAndStatusNot(patientId, AppointmentStatus.ANNULE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> listerParPeriode(
            LocalDateTime debut, LocalDateTime fin) {
        return appointmentRepo.findByPeriode(debut, fin)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AppointmentResponse confirmer(String id) {
        Appointment rdv = getOrThrow(id);
        rdv.setStatus(AppointmentStatus.CONFIRME);
        return toResponse(appointmentRepo.save(rdv));
    }

    @Transactional
    public AppointmentResponse annuler(String id) {

        Appointment rdv = getOrThrow(id);

        // Règle 3 — annulation uniquement 24h avant
        if (LocalDateTime.now().isAfter(
                rdv.getTimeSlot().getDebut().minusHours(24))) {
            throw new IllegalStateException(
                    "Annulation impossible moins de 24h avant le rendez-vous");
        }

        rdv.setStatus(AppointmentStatus.ANNULE);
        return toResponse(appointmentRepo.save(rdv));
    }

    @Transactional
    public AppointmentResponse terminer(String id) {
        Appointment rdv = getOrThrow(id);
        rdv.setStatus(AppointmentStatus.TERMINE);
        return toResponse(appointmentRepo.save(rdv));
    }

    private Appointment getOrThrow(String id) {
        return appointmentRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Rendez-vous introuvable"));
    }

    private AppointmentResponse toResponse(Appointment a) {
        return new AppointmentResponse(
                a.getId(),
                a.getPatientId(),
                a.getMedecinId(),
                a.getTimeSlot().getDebut(),
                a.getTimeSlot().getFin(),
                a.getMotif(),
                a.getSalle(),
                a.getNotes(),
                a.getStatus(),
                a.getCreatedAt()
        );
    }
}