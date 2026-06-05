CREATE TABLE invoices (
                          id               VARCHAR(36)    PRIMARY KEY,
                          patient_id       VARCHAR(36)    NOT NULL REFERENCES patients(id),
                          appointment_id   VARCHAR(36)    REFERENCES appointments(id),
                          prescription_id  VARCHAR(36)    REFERENCES prescriptions(id),
                          date_facture     DATE           NOT NULL,
                          date_echeance    DATE,
                          montant_total    DECIMAL(10,2)  NOT NULL DEFAULT 0,
                          montant_paye     DECIMAL(10,2)  NOT NULL DEFAULT 0,
                          status           VARCHAR(30)    NOT NULL DEFAULT 'EN_ATTENTE',
                          notes            TEXT,
                          created_at       TIMESTAMP      NOT NULL DEFAULT NOW(),
                          updated_at       TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE invoice_lines (
                               invoice_id     VARCHAR(36)    NOT NULL REFERENCES invoices(id),
                               description    VARCHAR(255),
                               quantite       INTEGER,
                               prix_unitaire  DECIMAL(10,2)
);

CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_invoices_status  ON invoices(status);