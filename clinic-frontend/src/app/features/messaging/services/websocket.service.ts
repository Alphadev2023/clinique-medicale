import { Injectable, signal } from '@angular/core';
import { Client, Message as StompMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../../environments/environment';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private client!: Client;
  connected = signal(false);
  newMessage = signal<Message | null>(null);

  connect(userId: string, token: string) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.wsUrl),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        this.connected.set(true);
        // Écoute les messages privés
        this.client.subscribe(
          `/user/${userId}/queue/messages`,
          (msg: StompMessage) => {
            const message = JSON.parse(msg.body) as Message;
            this.newMessage.set(message);
          },
        );
        // Écoute les notifications
        this.client.subscribe(
          `/user/${userId}/queue/notifications`,
          (msg: StompMessage) => {
            const message = JSON.parse(msg.body) as Message;
            this.newMessage.set(message);
          },
        );
      },
      onDisconnect: () => this.connected.set(false),
      reconnectDelay: 5000,
    });
    this.client.activate();
  }

  sendMessage(destination: string, body: any) {
    if (this.client?.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    }
  }

  disconnect() {
    this.client?.deactivate();
    this.connected.set(false);
  }
}
