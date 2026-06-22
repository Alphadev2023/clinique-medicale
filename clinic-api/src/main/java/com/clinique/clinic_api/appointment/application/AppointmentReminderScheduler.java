package com.clinique.clinic_api.appointment.application;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AppointmentReminderScheduler {

    private final AppointmentService appointmentService;

    // Toutes les 15 minutes — suffisant pour rester dans la fenêtre des 24h sans surcharger la base.
    @Scheduled(fixedRate = 15 * 60 * 1000)
    public void verifierRappels() {
        appointmentService.envoyerRappels();
    }
}