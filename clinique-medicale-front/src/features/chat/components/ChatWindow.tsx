// src/features/chat/components/ChatWindow.tsx

import { useEffect, useRef } from "react";
import { useAuth } from "../../../application/auth/useAuth";
import { useChat } from "../useChat";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { Spinner } from "../../../presentation/components/ui/Spinner";
import { getNomComplet } from "../../../domain/user";
import type { User } from "../../../domain/user";

interface ChatWindowProps {
  destinataire: User;
}

export function ChatWindow({ destinataire }: ChatWindowProps) {
  const user = useAuth((state) => state.user);
  const { messages, envoyer, isLoading } = useChat(destinataire.id);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {destinataire.prenom.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {getNomComplet(destinataire)}
          </p>
          <p className="text-xs text-gray-500">{destinataire.role}</p>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {isLoading ? (
          <Spinner size={24} />
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Aucun message pour l'instant
          </p>
        ) : (
          messages.map((m) => (
            <ChatBubble
              key={m.id}
              message={m}
              estMoi={m.expediteurId === user?.id}
            />
          ))
        )}
        <div ref={finRef} />
      </div>
      <ChatInput onSend={envoyer} />
    </div>
  );
}
