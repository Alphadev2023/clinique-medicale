// src/features/chat/useChat.ts

import { useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { chatService } from "./chatService";
import { useChatStore } from "./useChatStore";
import { useAuth } from "../../application/auth/useAuth";
import type { MessagePayload } from "./types";

export function useChat(autreUtilisateurId: string | null) {
  const user = useAuth((state) => state.user);
  const conversations = useChatStore((state) => state.conversations);
  const setConversationHistory = useChatStore(
    (state) => state.setConversationHistory,
  );
  const addMessage = useChatStore((state) => state.addMessage);
  const clearUnread = useChatStore((state) => state.clearUnread);

  const { isLoading } = useQuery({
    queryKey: ["chat-conversation", user?.id, autreUtilisateurId],
    queryFn: async () => {
      if (!user || !autreUtilisateurId) return [];
      const messages = await chatService.conversation(
        user.id,
        autreUtilisateurId,
      );
      setConversationHistory(autreUtilisateurId, messages);
      return messages;
    },
    enabled: Boolean(user && autreUtilisateurId),
  });

  useEffect(() => {
    if (!user || !autreUtilisateurId) return;
    const nonLus = (conversations[autreUtilisateurId] ?? []).filter(
      (m) => m.destinataireId === user.id && !m.lu,
    );
    if (nonLus.length > 0) {
      Promise.allSettled(nonLus.map((m) => chatService.marquerLu(m.id)));
    }
    clearUnread(autreUtilisateurId);
  }, [autreUtilisateurId, conversations, user, clearUnread]);

  const { mutate: envoyerMutation, isPending: isSending } = useMutation({
    mutationFn: chatService.envoyer,
  });

  const envoyer = useCallback(
    (contenu: string, imageUrl?: string) => {
      if (!user || !autreUtilisateurId) return;
      const payload: MessagePayload = {
        expediteurId: user.id,
        expediteurNom: `${user.prenom} ${user.nom}`,
        destinataireId: autreUtilisateurId,
        contenu: contenu || " ",
        type: "CHAT",
        imageUrl,
      };
      envoyerMutation(payload, {
        onSuccess: (message) => addMessage(message, user.id),
      });
    },
    [user, autreUtilisateurId, envoyerMutation, addMessage],
  );

  const messages = autreUtilisateurId
    ? (conversations[autreUtilisateurId] ?? [])
    : [];

  return { messages, envoyer, isSending, isLoading };
}
