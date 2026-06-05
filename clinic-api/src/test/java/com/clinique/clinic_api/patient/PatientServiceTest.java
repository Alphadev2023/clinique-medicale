package com.clinique.clinic_api.patient;

import com.clinique.clinic_api.patient.application.PatientService;
import com.clinique.clinic_api.patient.domain.Patient;
import com.clinique.clinic_api.patient.infrastructure.PatientJpaRepository;
import com.clinique.clinic_api.patient.interfaces.dto.PatientRequest;
import com.clinique.clinic_api.patient.interfaces.dto.PatientResponse;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests PatientService")
class PatientServiceTest {

    @Mock private PatientJpaRepository patientRepo;
    @InjectMocks private PatientService patientService;

    private Patient testPatient;

    @BeforeEach
    void setUp() {
        testPatient = Patient.builder()
                .id("patient-123")
                .nom("Camara")
                .prenom("Yaya")
                .email("yaya@gmail.com")
                .telephone("621333649")
                .dateNaissance(LocalDate.of(2000, 6, 9))
                .genre(Patient.Genre.MASCULIN)    // ← ajoute
                .actif(true)
                .allergies(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("Lister tous les patients actifs")
    void listerPatients_success() {
        when(patientRepo.findByActifTrue()).thenReturn(List.of(testPatient));

        var patients = patientService.listerPatients();

        assertThat(patients).hasSize(1);
        assertThat(patients.get(0).nom()).isEqualTo("Camara");
        verify(patientRepo, times(1)).findByActifTrue();
    }

    @Test
    @DisplayName("Trouver un patient par ID")
    void getPatient_success() {
        when(patientRepo.findById("patient-123"))
                .thenReturn(Optional.of(testPatient));

        PatientResponse patient = patientService.getPatient("patient-123");

        assertThat(patient).isNotNull();
        assertThat(patient.email()).isEqualTo("yaya@gmail.com");
    }

    @Test
    @DisplayName("Trouver un patient inexistant lance une exception")
    void getPatient_notFound() {
        when(patientRepo.findById("inconnu"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> patientService.getPatient("inconnu"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Patient introuvable");
    }

    @Test
    @DisplayName("Créer un nouveau patient")
    void creerPatient_success() {
        PatientRequest req = new PatientRequest(
                "Camara", "Yaya", "yaya@gmail.com",
                "621333649", LocalDate.of(2000, 6, 9),
                Patient.Genre.MASCULIN,    // ← remplace "MASCULIN"
                "Yaoundé", null, null, List.of()
        );
        when(patientRepo.existsByEmail("yaya@gmail.com")).thenReturn(false);
        when(patientRepo.save(any(Patient.class))).thenReturn(testPatient);

        PatientResponse patient = patientService.creerPatient(req);

        assertThat(patient).isNotNull();
        verify(patientRepo, times(1)).save(any(Patient.class));
    }

    @Test
    @DisplayName("Créer un patient avec email existant échoue")
    void creerPatient_fail_email_exists() {
        PatientRequest req = new PatientRequest(
                "Camara", "Yaya", "yaya@gmail.com",
                "621333649", LocalDate.of(2000, 6, 9),
                Patient.Genre.MASCULIN,    // ← remplace "MASCULIN"
                "Yaoundé", null, null, List.of()
        );
        when(patientRepo.existsByEmail("yaya@gmail.com")).thenReturn(true);

        assertThatThrownBy(() -> patientService.creerPatient(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("existe déjà");
    }

    @Test
    @DisplayName("Supprimer un patient — soft delete")
    void supprimerPatient_success() {
        when(patientRepo.findById("patient-123"))
                .thenReturn(Optional.of(testPatient));
        when(patientRepo.save(any(Patient.class))).thenReturn(testPatient);

        patientService.supprimerPatient("patient-123");

        assertThat(testPatient.isActif()).isFalse();
        verify(patientRepo, times(1)).save(testPatient);
    }

    @Test
    @DisplayName("Supprimer un patient inexistant lance une exception")
    void supprimerPatient_notFound() {
        when(patientRepo.findById("inconnu"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> patientService.supprimerPatient("inconnu"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Patient introuvable");
    }

    @Test
    @DisplayName("Rechercher des patients")
    void rechercherPatients_success() {
        when(patientRepo.searchPatients("Yaya"))
                .thenReturn(List.of(testPatient));

        var results = patientService.rechercherPatients("Yaya");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).prenom()).isEqualTo("Yaya");
    }
}