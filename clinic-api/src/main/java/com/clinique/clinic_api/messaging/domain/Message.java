package com.clinique.clinic_api.messaging.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String expediteurId;

    @Column(nullable = false)
    private String expediteurNom;

    // null = message broadcast à tous
    private String destinataireId;

    @Column(nullable = false, length = 2000)
    private String contenu;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MessageType type = MessageType.CHAT;

    @Builder.Default
    private boolean lu = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(length = 5000)
    private String imageUrl;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum MessageType {
        CHAT,           // message entre utilisateurs
        NOTIFICATION,   // notification système (nouveau RDV, etc.)
        RAPPEL          // rappel de RDV
    }
}