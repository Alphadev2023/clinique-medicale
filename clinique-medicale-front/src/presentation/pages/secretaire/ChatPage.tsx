// src/presentation/pages/admin/ChatPage.tsx (identique pour medecin et secretaire — seul le chemin du fichier change)
import { useEffect, useState } from "react";
import { ConversationList } from "../../../features/chat/components/ConversationList";
import { ChatWindow } from "../../../features/chat/components/ChatWindow";
import { useChatStore } from "../../../features/chat/useChatStore";
import type { User } from "../../../domain/user";

export default function ChatPage() {
  const [selected, setSelected] = useState<User | null>(null);
  const setConversationOuverte = useChatStore(
    (state) => state.setConversationOuverte,
  );

  useEffect(() => {
    setConversationOuverte(selected?.id ?? null);
  }, [selected, setConversationOuverte]);

  useEffect(() => {
    return () => setConversationOuverte(null);
  }, [setConversationOuverte]);

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="w-72 shrink-0">
        <ConversationList
          selectedUserId={selected?.id ?? null}
          onSelect={setSelected}
        />
      </div>
      <div className="flex-1">
        {selected ? (
          <ChatWindow destinataire={selected} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Sélectionne une conversation
          </div>
        )}
      </div>
    </div>
  );
}
