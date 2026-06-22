// src/features/chat/useUnreadCounts.ts
// Hydrate les compteurs au chargement de la page à partir de GET /messages/non-lus/{userId}
// (qui mélange CHAT/NOTIFICATION/RAPPEL — on filtre côté client sur type === 'CHAT').

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "./chatService";
import { useChatStore } from "./useChatStore";
import { useAuth } from "../../application/auth/useAuth";

export function useUnreadCounts() {
  const user = useAuth((state) => state.user);
  const setUnreadCounts = useChatStore((state) => state.setUnreadCounts);

  const { data } = useQuery({
    queryKey: ["chat-non-lus", user?.id],
    queryFn: () => chatService.nonLus(user?.id ?? ""),
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (!data) return;
    const compteurs: Record<string, number> = {};
    data
      .filter((m) => m.type === "CHAT")
      .forEach((m) => {
        compteurs[m.expediteurId] = (compteurs[m.expediteurId] ?? 0) + 1;
      });
    setUnreadCounts(compteurs);
  }, [data, setUnreadCounts]);
}
