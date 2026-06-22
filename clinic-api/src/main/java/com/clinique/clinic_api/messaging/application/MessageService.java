package com.clinique.clinic_api.messaging.application;

import com.clinique.clinic_api.messaging.domain.Message;
import com.clinique.clinic_api.messaging.domain.Message.MessageType;
import com.clinique.clinic_api.messaging.infrastructure.MessageJpaRepository;
import com.clinique.clinic_api.messaging.interfaces.dto.MessageRequest;
import com.clinique.clinic_api.messaging.interfaces.dto.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageJpaRepository messageRepo;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public MessageResponse envoyerMessage(MessageRequest req) {
        Message message = Message.builder()
                .expediteurId(req.expediteurId())
                .expediteurNom(req.expediteurNom())
                .destinataireId(req.destinataireId())
                .contenu(req.contenu() != null ? req.contenu() : "")
                .type(req.type() != null ? req.type() : MessageType.CHAT)
                .imageUrl(req.imageUrl())
                .lu(false)
                .build();

        Message saved = messageRepo.save(message);
        MessageResponse response = toResponse(saved);

        if (req.destinataireId() != null) {
            messagingTemplate.convertAndSendToUser(
                    req.destinataireId(),
                    "/queue/messages",
                    response
            );

            // ← Crée une notification pour le destinataire
            if (req.type() == MessageType.CHAT) {
                Message notif = Message.builder()
                        .expediteurId(req.expediteurId())
                        .expediteurNom(req.expediteurNom())
                        .destinataireId(req.destinataireId())
                        .contenu(req.contenu() != null && !req.contenu().isBlank()
                                ? req.expediteurNom() + ": " + req.contenu()
                                : req.expediteurNom() + " a envoyé une image")
                        .type(MessageType.NOTIFICATION)
                        .lu(false)
                        .build();
                messageRepo.save(notif);
            }
        } else {
            messagingTemplate.convertAndSend("/topic/messages", response);
        }

        return response;
    }

    @Transactional
    public void envoyerNotification(String destinataireId,
                                    String contenu,
                                    MessageType type) {
        Message notif = Message.builder()
                .expediteurId("SYSTEM")
                .expediteurNom("Système")
                .destinataireId(destinataireId)
                .contenu(contenu)
                .type(type)
                .build();

        Message saved = messageRepo.save(notif);

        // Envoi temps réel
        messagingTemplate.convertAndSendToUser(
                destinataireId,
                "/queue/notifications",
                toResponse(saved)
        );
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getConversation(
            String userId1, String userId2) {
        return messageRepo.findConversation(userId1, userId2)
                .stream()
                .filter(m -> m.getType() == MessageType.CHAT)  // ← ajoute ce filtre
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessagesNonLus(String userId) {
        return messageRepo.findMessagesNonLus(userId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getNotificationsNonLues(String userId) {
        return messageRepo.findNotificationsNonLues(userId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void marquerCommeLu(String messageId) {
        messageRepo.findById(messageId).ifPresent(m -> {
            m.setLu(true);
            messageRepo.save(m);
        });
    }

    @Transactional
    public void marquerTousCommeLus(String userId) {
        messageRepo.findMessagesNonLus(userId).forEach(m -> {
            m.setLu(true);
            messageRepo.save(m);
        });
    }

    @Transactional(readOnly = true)
    public long countNonLus(String userId) {
        return messageRepo.findMessagesNonLus(userId).size();
    }

    private MessageResponse toResponse(Message m) {
        return new MessageResponse(
                m.getId(), m.getExpediteurId(), m.getExpediteurNom(),
                m.getDestinataireId(), m.getContenu(), m.getType(),
                m.isLu(), m.getImageUrl(), m.getCreatedAt()
        );
    }
}