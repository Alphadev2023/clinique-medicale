package com.clinique.clinic_api.messaging.infrastructure;

import com.clinique.clinic_api.messaging.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageJpaRepository extends JpaRepository<Message, String> {

    // Conversation entre deux utilisateurs
    @Query("SELECT m FROM Message m WHERE " +
            "(m.expediteurId = :userId1 AND m.destinataireId = :userId2) OR " +
            "(m.expediteurId = :userId2 AND m.destinataireId = :userId1) " +
            "ORDER BY m.createdAt ASC")
    List<Message> findConversation(
            @Param("userId1") String userId1,
            @Param("userId2") String userId2
    );

    // Messages non lus d'un utilisateur
    @Query("SELECT m FROM Message m WHERE " +
            "m.destinataireId = :userId AND m.lu = false " +
            "ORDER BY m.createdAt DESC")
    List<Message> findMessagesNonLus(@Param("userId") String userId);

    // Notifications non lues
    @Query("SELECT m FROM Message m WHERE " +
            "m.destinataireId = :userId AND " +
            "m.type IN ('NOTIFICATION', 'RAPPEL') AND " +
            "m.lu = false")
    List<Message> findNotificationsNonLues(@Param("userId") String userId);

    // Historique complet d'un utilisateur
    @Query("SELECT m FROM Message m WHERE " +
            "m.expediteurId = :userId OR m.destinataireId = :userId " +
            "ORDER BY m.createdAt DESC")
    List<Message> findHistorique(@Param("userId") String userId);
}