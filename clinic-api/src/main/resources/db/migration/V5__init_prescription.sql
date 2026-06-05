CREATE TABLE prescriptions (
                               id                  VARCHAR(36)  PRIMARY KEY,
                               patient_id          VARCHAR(36)  NOT NULL REFERENCES patients(id),
                               medecin_id          VARCHAR(36)  NOT NULL REFERENCES users(id),
                               appointment_id      VARCHAR(36)  REFERENCES appointments(id),
                               date_prescription   DATE         NOT NULL,
                               date_expiration     DATE         NOT NULL,
                               diagnostic          TEXT,
                               notes               TEXT,
                               status              VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
                               created_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE prescription_drugs (
                                    prescription_id  VARCHAR(36)   NOT NULL REFERENCES prescriptions(id),
                                    medicament       VARCHAR(200),
                                    dosage           VARCHAR(100),
                                    frequence        VARCHAR(100),
                                    duree            VARCHAR(100),
                                    instructions     TEXT
);

CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_medecin ON prescriptions(medecin_id);