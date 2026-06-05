CREATE TABLE messages (
                          id               VARCHAR(36)   PRIMARY KEY,
                          expediteur_id    VARCHAR(36)   NOT NULL,
                          expediteur_nom   VARCHAR(100)  NOT NULL,
                          destinataire_id  VARCHAR(36),
                          contenu          VARCHAR(2000) NOT NULL,
                          type             VARCHAR(20)   NOT NULL DEFAULT 'CHAT',
                          lu               BOOLEAN       NOT NULL DEFAULT FALSE,
                          created_at       TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_destinataire ON messages(destinataire_id);
CREATE INDEX idx_messages_expediteur   ON messages(expediteur_id);
CREATE INDEX idx_messages_lu           ON messages(lu);