import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  effect,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { WebsocketService } from '../services/websocket.service';
import { UserService, UserSummary } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  LucideAngularModule,
  Send,
  MessageSquare,
  Users,
  Bell,
  Check,
  X,
  Image as ImageIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  readonly Send = Send;
  readonly MessageSquare = MessageSquare;
  readonly Users = Users;
  readonly Bell = Bell;
  readonly Check = Check;
  readonly ImageIcon = ImageIcon; // ← renomme
  readonly X = X;

  users = signal<UserSummary[]>([]);
  selectedUser = signal<UserSummary | null>(null);
  messages = signal<Message[]>([]);
  notifications = signal<Message[]>([]);
  newMessage = signal('');
  loading = signal(false);
  activeTab = signal<'chat' | 'notifications'>('chat');
  private unreadCounts = signal<Map<string, number>>(new Map());

  uploadingImage = signal(false);
  imagePreview = signal<string | null>(null);
  pendingImageUrl = signal<string | null>(null);

  private pollingInterval: any;

  constructor(
    private messageService: MessageService,
    public websocketService: WebsocketService,
    private userService: UserService,
    private authService: AuthService,
    private http: HttpClient,
  ) {
    effect(() => {
      const msg = this.websocketService.newMessage();
      if (msg && msg.type === 'CHAT') {
        this.messages.update((msgs) => [...msgs, msg]);
        this.scrollToBottom();
      }
      if (msg && (msg.type === 'NOTIFICATION' || msg.type === 'RAPPEL')) {
        this.notifications.update((notifs) => [msg, ...notifs]);
      }
    });
  }

  ngOnInit() {
    const token = this.authService.getToken()!;
    const userId = this.getCurrentUserId();
    if (userId) {
      this.websocketService.connect(userId, token);
      this.loadNotifications();
    }

    this.userService.getAll().subscribe({
      next: (users) => {
        const currentId = this.getCurrentUserId();
        this.users.set(users.filter((u) => u.id !== currentId));
      },
    });

    // Polling toutes les 3 secondes
    this.pollingInterval = setInterval(() => {
      const selected = this.selectedUser();
      if (selected) {
        this.refreshMessages(selected.id);
        // Si conversation ouverte, reset les badges de cet utilisateur
        const counts = new Map(this.unreadCounts());
        counts.set(selected.id, 0);
        this.unreadCounts.set(counts);
      } else {
        // Seulement si aucune conversation ouverte
        this.loadUnreadCounts();
      }
      this.loadNotifications();
    }, 3000);
  }

  ngOnDestroy() {
    this.websocketService.disconnect();
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  getCurrentUserId(): string {
    return this.authService.currentUser()?.id || '';
  }

  openImage(url: string) {
    window.open(this.getImageUrl(url), '_blank');
  }

  selectUser(user: UserSummary) {
    this.selectedUser.set(user);
    this.activeTab.set('chat');
    this.loadConversation(user.id);

    // Reset badge immédiatement
    const counts = new Map(this.unreadCounts());
    counts.set(user.id, 0);
    this.unreadCounts.set(counts);

    // Marquer tous les messages de cet utilisateur comme lus
    const currentId = this.getCurrentUserId();
    if (currentId) {
      this.messageService.marquerTousLus(currentId).subscribe();
    }
  }

  loadConversation(userId2: string) {
    const userId1 = this.getCurrentUserId();
    if (!userId1) return;
    this.loading.set(true);
    this.messageService.getConversation(userId1, userId2).subscribe({
      next: (msgs) => {
        this.messages.set(msgs);
        this.loading.set(false);
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: () => this.loading.set(false),
    });
  }

  refreshMessages(userId2: string) {
    const userId1 = this.getCurrentUserId();
    if (!userId1) return;
    this.messageService.getConversation(userId1, userId2).subscribe({
      next: (msgs) => {
        const current = this.messages();
        // Met à jour seulement si nouveaux messages
        if (msgs.length !== current.length) {
          this.messages.set(msgs);
          setTimeout(() => this.scrollToBottom(), 50);
        }
      },
    });
  }

  loadNotifications() {
    const userId = this.getCurrentUserId();
    if (!userId) return;
    this.messageService.getNotifications(userId).subscribe({
      next: (notifs) => this.notifications.set(notifs),
    });
  }

  marquerTousLus() {
    const userId = this.getCurrentUserId();
    if (!userId) return;
    this.messageService.marquerTousLus(userId).subscribe({
      next: () => this.notifications.set([]),
    });
  }

  scrollToBottom() {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }

  isMyMessage(msg: Message): boolean {
    return msg.expediteurId === this.getCurrentUserId();
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getUnreadCount(userId: string): number {
    return this.unreadCounts().get(userId) || 0;
  }

  loadUnreadCounts() {
    const currentId = this.getCurrentUserId();
    if (!currentId) return;
    this.messageService.getNonLus(currentId).subscribe({
      next: (msgs) => {
        const counts = new Map<string, number>();
        msgs.forEach((m) => {
          const count = counts.get(m.expediteurId) || 0;
          counts.set(m.expediteurId, count + 1);
        });
        this.unreadCounts.set(counts);
      },
    });
  }

  openFileSelector() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    this.uploadingImage.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post<{ url: string }>(`${environment.apiUrl}/upload/image`, formData)
      .subscribe({
        next: (res) => {
          this.pendingImageUrl.set(res.url);
          this.uploadingImage.set(false);
        },
        error: () => {
          this.uploadingImage.set(false);
          this.imagePreview.set(null);
        },
      });
  }

  cancelImage() {
    this.imagePreview.set(null);
    this.pendingImageUrl.set(null);
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  sendMessage() {
    const contenu = this.newMessage().trim();
    const dest = this.selectedUser();
    const imageUrl = this.pendingImageUrl();

    if ((!contenu && !imageUrl) || !dest) return;

    const req = {
      expediteurId: this.getCurrentUserId(),
      expediteurNom: this.authService.userName(),
      destinataireId: dest.id,
      contenu: contenu || ' ',
      type: 'CHAT' as const,
      imageUrl: imageUrl || null,
    };

    this.messageService.envoyer(req).subscribe({
      next: (msg) => {
        this.messages.update((msgs) => [...msgs, msg]);
        this.newMessage.set('');
        this.imagePreview.set(null);
        this.pendingImageUrl.set(null);
        if (this.fileInput) this.fileInput.nativeElement.value = '';
        setTimeout(() => this.scrollToBottom(), 50);
      },
    });
  }

  getImageUrl(url: string): string {
    return `${environment.apiUrl.replace('/api', '')}${url}`;
  }
}
