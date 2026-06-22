// src/features/chat/useTotalUnreadCount.ts

import { useChatStore } from "./useChatStore";

export function useTotalUnreadCount(): number {
  return useChatStore((state) =>
    Object.values(state.unreadCounts).reduce((sum, n) => sum + n, 0),
  );
}
