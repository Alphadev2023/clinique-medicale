package com.clinique.clinic_api.prescription.infrastructure;

import com.clinique.clinic_api.prescription.domain.Prescription;
import com.clinique.clinic_api.prescription.domain.Prescription.PrescriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionJpaRepository extends JpaRepository<Prescription, String> {

    List<Prescription> findByPatientId(String patientId);

    List<Prescription> findByMedecinId(String medecinId);

    List<Prescription> findByPatientIdAndStatus(
            String patientId,
            PrescriptionStatus status
    );

    List<Prescription> findByAppointmentId(String appointmentId);
}