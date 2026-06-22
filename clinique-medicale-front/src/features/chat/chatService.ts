// src/features/chat/chatService.ts

import { apiClient } from "../../infrastructure/apiClient";
import type { ChatMessage, MessagePayload } from "./types";

export const chatService = {
  envoyer: async (payload: MessagePayload): Promise<ChatMessage> => {
    const { data } = await apiClient.post<ChatMessage>("/messages", payload);
    return data;
  },

  conversation: async (
    userId1: string,
    userId2: string,
  ): Promise<ChatMessage[]> => {
    const { data } = await apiClient.get<ChatMessage[]>(
      "/messages/conversation",
      {
        params: { userId1, userId2 },
      },
    );
    return data;
  },

  nonLus: async (userId: string): Promise<ChatMessage[]> => {
    const { data } = await apiClient.get<ChatMessage[]>(
      `/messages/non-lus/${userId}`,
    );
    return data;
  },

  notificationsNonLues: async (userId: string): Promise<ChatMessage[]> => {
    const { data } = await apiClient.get<ChatMessage[]>(
      `/messages/notifications/${userId}`,
    );
    return data;
  },

  marquerLu: async (id: string): Promise<void> => {
    await apiClient.patch(`/messages/${id}/lu`);
  },

  marquerTousLus: async (userId: string): Promise<void> => {
    await apiClient.patch(`/messages/tous-lus/${userId}`);
  },

  uploaderImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<{ url: string }>(
      "/upload/image",
      formData,
    );
    return data.url;
  },
};

export function getImageUrl(path: string): string {
  const apiBase = import.meta.env.VITE_API_URL as string;
  const serverBase = apiBase.replace(/\/api\/?$/, "");
  return `${serverBase}${path}`;
}
