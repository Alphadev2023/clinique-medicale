CREATE TABLE appointments (
                              id          VARCHAR(36)  PRIMARY KEY,
                              patient_id  VARCHAR(36)  NOT NULL REFERENCES patients(id),
                              medecin_id  VARCHAR(36)  NOT NULL REFERENCES users(id),
                              debut       TIMESTAMP    NOT NULL,
                              fin         TIMESTAMP    NOT NULL,
                              motif       VARCHAR(500),
                              salle       VARCHAR(50),
                              notes       TEXT,
                              status      VARCHAR(20)  NOT NULL DEFAULT 'PLANIFIE',
                              created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
                              updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_medecin ON appointments(medecin_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_debut   ON appointments(debut);