CREATE TABLE users (
                       id          VARCHAR(36)  PRIMARY KEY,
                       email       VARCHAR(255) NOT NULL UNIQUE,
                       password    VARCHAR(255) NOT NULL,
                       nom         VARCHAR(100) NOT NULL,
                       prenom      VARCHAR(100) NOT NULL,
                       role        VARCHAR(20)  NOT NULL,
                       actif       BOOLEAN      NOT NULL DEFAULT TRUE,
                       created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);