CREATE TABLE event_publication (
                                   id               UUID         NOT NULL PRIMARY KEY,
                                   listener_id      VARCHAR(512) NOT NULL,
                                   event_type       VARCHAR(512) NOT NULL,
                                   serialized_event VARCHAR(2048) NOT NULL,
                                   publication_date TIMESTAMP    NOT NULL,
                                   completion_date  TIMESTAMP
);