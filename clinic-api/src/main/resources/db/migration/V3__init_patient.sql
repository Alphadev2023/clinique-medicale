CREATE TABLE patients (
                          id                        VARCHAR(36)  PRIMARY KEY,
                          nom                       VARCHAR(100) NOT NULL,
                          prenom                    VARCHAR(100) NOT NULL,
                          email                     VARCHAR(255) NOT NULL UNIQUE,
                          telephone                 VARCHAR(20),
                          date_naissance            DATE         NOT NULL,
                          genre                     VARCHAR(20),
                          adresse                   VARCHAR(500),
                          numero_securite_sociale   VARCHAR(50),
                          antecedents               TEXT,
                          maladies_chroniques       TEXT,
                          chirurgies                TEXT,
                          traitements_en_cours      TEXT,
                          actif                     BOOLEAN      NOT NULL DEFAULT TRUE,
                          created_at                TIMESTAMP    NOT NULL DEFAULT NOW(),
                          updated_at                TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE patient_allergies (
                                   patient_id  VARCHAR(36)  NOT NULL REFERENCES patients(id),
                                   nom         VARCHAR(100),
                                   severite    VARCHAR(20),
                                   reaction    VARCHAR(255)
);