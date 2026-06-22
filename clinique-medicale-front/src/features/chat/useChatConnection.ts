// src/features/chat/useChatConnection.ts
// Appelé une seule fois au niveau du Layout — reste actif tant que l'utilisateur
// est connecté, peu importe la page affichée.

import { useEffect } from "react";
import type { Client } from "@stomp/stompjs";
import { createChatSocket } from "./chatSocket";
import { useChatStore } from "./useChatStore";
import { useAuth } from "../../application/auth/useAuth";

export function useChatConnection() {
  const user = useAuth((state) => state.user);
  const addMessage = useChatStore((state) => state.addMessage);
  const addNotification = useChatStore((state) => state.addNotification);
  const incrementUnread = useChatStore((state) => state.incrementUnread);

  useEffect(() => {
    if (!user) return;

    const client: Client = createChatSocket(
      user.id,
      (message) => {
        addMessage(message, user.id);
        const conversationOuverte =
          useChatStore.getState().conversationOuverteId;
        if (message.expediteurId !== conversationOuverte) {
          incrementUnread(message.expediteurId);
        }
      },
      (notification) => addNotification(notification),
    );

    return () => {
      client.deactivate();
    };
  }, [user, addMessage, addNotification, incrementUnread]);
}
