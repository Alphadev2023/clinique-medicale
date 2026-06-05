package com.clinique.clinic_api.appointment;

import com.clinique.clinic_api.appointment.application.AppointmentService;
import com.clinique.clinic_api.appointment.domain.Appointment;
import com.clinique.clinic_api.appointment.domain.AppointmentStatus;
import com.clinique.clinic_api.appointment.domain.TimeSlot;
import com.clinique.clinic_api.appointment.infrastructure.AppointmentJpaRepository;
import com.clinique.clinic_api.appointment.interfaces.dto.AppointmentRequest;
import com.clinique.clinic_api.appointment.interfaces.dto.AppointmentResponse;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests AppointmentService")
class AppointmentServiceTest {

    @Mock private AppointmentJpaRepository appointmentRepo;
    @InjectMocks private AppointmentService appointmentService;

    private Appointment testAppointment;
    private final LocalDateTime DEBUT = LocalDateTime.now().plusDays(2);
    private final LocalDateTime FIN   = DEBUT.plusHours(1);

    @BeforeEach
    void setUp() {
        testAppointment = Appointment.builder()
                .id("rdv-123")
                .patientId("patient-123")
                .medecinId("medecin-123")
                .timeSlot(new TimeSlot(DEBUT, FIN))
                .motif("Consultation")
                .salle("Salle 1")
                .status(AppointmentStatus.PLANIFIE)
                .build();
    }

    @Test
    @DisplayName("Créer un RDV sans conflit")
    void creerRdv_success() {
        AppointmentRequest req = new AppointmentRequest(
                "patient-123", "medecin-123",
                DEBUT, FIN, "Consultation", "Salle 1", null
        );
        when(appointmentRepo.existsConflitMedecin(anyString(), any(), any()))
                .thenReturn(false);
        when(appointmentRepo.existsConflitPatientMemeJour(anyString(), any()))
                .thenReturn(false);
        when(appointmentRepo.save(any(Appointment.class)))
                .thenReturn(testAppointment);

        AppointmentResponse rdv = appointmentService.creerRdv(req);

        assertThat(rdv).isNotNull();
        assertThat(rdv.motif()).isEqualTo("Consultation");
        verify(appointmentRepo, times(1)).save(any(Appointment.class));
    }

    @Test
    @DisplayName("Créer un RDV en conflit médecin lance une exception")
    void creerRdv_conflit_medecin() {
        AppointmentRequest req = new AppointmentRequest(
                "patient-123", "medecin-123",
                DEBUT, FIN, "Consultation", "Salle 1", null
        );
        when(appointmentRepo.existsConflitMedecin(anyString(), any(), any()))
                .thenReturn(true);

        assertThatThrownBy(() -> appointmentService.creerRdv(req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("déjà un rendez-vous");
    }

    @Test
    @DisplayName("Créer un RDV en conflit patient lance une exception")
    void creerRdv_conflit_patient() {
        AppointmentRequest req = new AppointmentRequest(
                "patient-123", "medecin-123",
                DEBUT, FIN, "Consultation", "Salle 1", null
        );
        when(appointmentRepo.existsConflitMedecin(anyString(), any(), any()))
                .thenReturn(false);
        when(appointmentRepo.existsConflitPatientMemeJour(anyString(), any()))
                .thenReturn(true);

        assertThatThrownBy(() -> appointmentService.creerRdv(req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("déjà un rendez-vous");
    }

    @Test
    @DisplayName("Confirmer un RDV planifié")
    void confirmer_success() {
        when(appointmentRepo.findById("rdv-123"))
                .thenReturn(Optional.of(testAppointment));
        when(appointmentRepo.save(any())).thenReturn(testAppointment);

        appointmentService.confirmer("rdv-123");

        assertThat(testAppointment.getStatus())
                .isEqualTo(AppointmentStatus.CONFIRME);
        verify(appointmentRepo, times(1)).save(testAppointment);
    }

    @Test
    @DisplayName("Annuler un RDV — plus de 24h avant")
    void annuler_success() {
        when(appointmentRepo.findById("rdv-123"))
                .thenReturn(Optional.of(testAppointment));
        when(appointmentRepo.save(any())).thenReturn(testAppointment);

        appointmentService.annuler("rdv-123");

        assertThat(testAppointment.getStatus())
                .isEqualTo(AppointmentStatus.ANNULE);
    }

    @Test
    @DisplayName("Annuler un RDV moins de 24h avant lance une exception")
    void annuler_trop_tard() {
        // RDV dans 30 minutes — annulation impossible
        Appointment rdvProche = Appointment.builder()
                .id("rdv-proche")
                .patientId("patient-123")
                .medecinId("medecin-123")
                .timeSlot(new TimeSlot(
                        LocalDateTime.now().plusMinutes(30),
                        LocalDateTime.now().plusMinutes(90)
                ))
                .status(AppointmentStatus.PLANIFIE)
                .build();

        when(appointmentRepo.findById("rdv-proche"))
                .thenReturn(Optional.of(rdvProche));

        assertThatThrownBy(() -> appointmentService.annuler("rdv-proche"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("24h");
    }

    @Test
    @DisplayName("Terminer un RDV")
    void terminer_success() {
        when(appointmentRepo.findById("rdv-123"))
                .thenReturn(Optional.of(testAppointment));
        when(appointmentRepo.save(any())).thenReturn(testAppointment);

        appointmentService.terminer("rdv-123");

        assertThat(testAppointment.getStatus())
                .isEqualTo(AppointmentStatus.TERMINE);
    }

    @Test
    @DisplayName("RDV introuvable lance une exception")
    void confirmer_notFound() {
        when(appointmentRepo.findById("inconnu"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> appointmentService.confirmer("inconnu"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Rendez-vous introuvable");
    }
}