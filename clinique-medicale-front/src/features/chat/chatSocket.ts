// src/features/chat/chatSocket.ts — remplacement complet

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "../../infrastructure/authStore";
import type { ChatMessage } from "./types";

type MessageHandler = (message: ChatMessage) => void;

export function createChatSocket(
  userId: string,
  onMessage: MessageHandler,
  onNotification: MessageHandler,
): Client {
  const token = useAuthStore.getState().token;
  const wsUrl = import.meta.env.VITE_WS_URL as string;

  const client = new Client({
    webSocketFactory: () => new SockJS(wsUrl) as unknown as WebSocket,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe(`/user/${userId}/queue/messages`, (frame) => {
        onMessage(JSON.parse(frame.body) as ChatMessage);
      });
      client.subscribe(`/user/${userId}/queue/notifications`, (frame) => {
        onNotification(JSON.parse(frame.body) as ChatMessage);
      });
    },
  });

  client.activate();
  return client;
}
