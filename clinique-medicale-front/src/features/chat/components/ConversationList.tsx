// src/features/chat/components/ConversationList.tsx

import { useChatStore } from "../useChatStore";
import { useUsers } from "../../../application/users/useUsers";
import { useAuth } from "../../../application/auth/useAuth";
import { getNomComplet } from "../../../domain/user";
import type { User } from "../../../domain/user";

interface ConversationListProps {
  selectedUserId: string | null;
  onSelect: (user: User) => void;
}

export function ConversationList({
  selectedUserId,
  onSelect,
}: ConversationListProps) {
  const currentUser = useAuth((state) => state.user);
  const { data: users, isLoading } = useUsers();
  const unreadCounts = useChatStore((state) => state.unreadCounts);

  const contacts = (users ?? []).filter((u) => u.id !== currentUser?.id);

  if (isLoading) {
    return <p className="p-4 text-sm text-gray-500">Chargement...</p>;
  }

  return (
    <div className="h-full overflow-y-auto border-r border-gray-200 bg-white">
      {contacts.map((contact) => {
        const isSelected = selectedUserId === contact.id;
        const unread = unreadCounts[contact.id] ?? 0;
        return (
          <button
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left text-sm transition-colors ${
              isSelected
                ? "border-primary-600 bg-primary-50"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
              {contact.prenom.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-medium ${isSelected ? "text-primary-700" : "text-gray-900"}`}
              >
                {getNomComplet(contact)}
              </p>
              <p className="truncate text-xs text-gray-500">{contact.role}</p>
            </div>
            {unread > 0 && (
              <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[11px] font-semibold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
