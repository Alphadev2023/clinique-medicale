export type MessageType = 'CHAT' | 'NOTIFICATION' | 'RAPPEL';

export interface Message {
  id: string;
  expediteurId: string;
  expediteurNom: string;
  destinataireId: string;
  contenu: string;
  type: MessageType;
  lu: boolean;
  imageUrl: string | null;
  createdAt: string;
}

export interface MessageRequest {
  expediteurId: string;
  expediteurNom: string;
  destinataireId: string;
  contenu: string;
  type: MessageType;
  imageUrl?: string | null;
}
