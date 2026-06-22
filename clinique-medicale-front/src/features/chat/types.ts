// src/features/chat/types.ts

export type MessageType = "CHAT" | "NOTIFICATION" | "RAPPEL";

export interface ChatMessage {
  id: string;
  expediteurId: string;
  expediteurNom: string;
  destinataireId: string | null;
  contenu: string;
  type: MessageType;
  lu: boolean;
  imageUrl: string | null;
  createdAt: string;
}

export interface MessagePayload {
  expediteurId: string;
  expediteurNom: string;
  destinataireId?: string;
  contenu: string;
  type?: MessageType;
  imageUrl?: string;
}
