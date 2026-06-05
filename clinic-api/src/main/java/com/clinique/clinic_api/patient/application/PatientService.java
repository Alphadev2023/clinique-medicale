package com.clinique.clinic_api.patient.application;

import com.clinique.clinic_api.patient.domain.Patient;
import com.clinique.clinic_api.patient.infrastructure.PatientJpaRepository;
import com.clinique.clinic_api.patient.interfaces.dto.PatientRequest;
import com.clinique.clinic_api.patient.interfaces.dto.PatientResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientJpaRepository patientRepo;

    @Transactional
    public PatientResponse creerPatient(PatientRequest req) {
        if (patientRepo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Un patient avec cet email existe déjà");
        }
        Patient patient = Patient.builder()
                .nom(req.nom())
                .prenom(req.prenom())
                .email(req.email())
                .telephone(req.telephone())
                .dateNaissance(req.dateNaissance())
                .genre(req.genre())
                .adresse(req.adresse())
                .numeroSecuriteSociale(req.numeroSecuriteSociale())
                .historiqueMedical(req.historiqueMedical())
                .allergies(req.allergies() != null ? req.allergies() : List.of())
                .build();
        return toResponse(patientRepo.save(patient));
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> listerPatients() {
        return patientRepo.findByActifTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PatientResponse getPatient(String id) {
        return patientRepo.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Patient introuvable"));
    }

    @Transactional
    public PatientResponse modifierPatient(String id, PatientRequest req) {
        Patient patient = patientRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient introuvable"));
        patient.setNom(req.nom());
        patient.setPrenom(req.prenom());
        patient.setEmail(req.email());
        patient.setTelephone(req.telephone());
        patient.setDateNaissance(req.dateNaissance());
        patient.setGenre(req.genre());
        patient.setAdresse(req.adresse());
        patient.setNumeroSecuriteSociale(req.numeroSecuriteSociale());
        patient.setHistoriqueMedical(req.historiqueMedical());
        if (req.allergies() != null) {
            patient.getAllergies().clear();
            patient.getAllergies().addAll(req.allergies());
        }
        return toResponse(patientRepo.save(patient));
    }

    @Transactional
    public void supprimerPatient(String id) {
        Patient patient = patientRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient introuvable"));
        patient.setActif(false);   // soft delete
        patientRepo.save(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> rechercherPatients(String search) {
        return patientRepo.searchPatients(search)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PatientResponse toResponse(Patient p) {
        return new PatientResponse(
                p.getId(), p.getNom(), p.getPrenom(), p.getEmail(),
                p.getTelephone(), p.getDateNaissance(), p.getGenre(),
                p.getAdresse(), p.getHistoriqueMedical(),
                p.getAllergies(), p.getCreatedAt()
        );
    }
}