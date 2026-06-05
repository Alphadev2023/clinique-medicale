import {
  Component,
  signal,
  HostListener,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SearchService, SearchResult } from '../../services/search.service';
import { MessageService } from '../../../features/messaging/services/message.service';
import {
  LucideAngularModule,
  Bell,
  Search,
  Users,
  Calendar,
  FileText,
  X,
} from 'lucide-angular';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  of,
} from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  readonly Bell = Bell;
  readonly Search = Search;
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  readonly X = X;

  searchQuery = signal('');
  searchResults = signal<SearchResult[]>([]);
  showResults = signal(false);
  searching = signal(false);
  notifCount = signal(0);
  showNotifPanel = signal(false);
  notifications = signal<any[]>([]);

  private searchSubject = new Subject<string>();
  private notifInterval: any;

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
    private messageService: MessageService,
    private router: Router,
    private elementRef: ElementRef,
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.trim().length < 2) {
            this.searchResults.set([]);
            this.searching.set(false);
            return of([]);
          }
          this.searching.set(true);
          return this.searchService.search(query);
        }),
      )
      .subscribe({
        next: (results) => {
          this.searchResults.set(results);
          this.searching.set(false);
          this.showResults.set(true);
        },
        error: () => this.searching.set(false),
      });
  }

  ngOnInit() {
    this.loadNotifications();
    // Polling notifications toutes les 10 secondes
    this.notifInterval = setInterval(() => {
      this.loadNotifications();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.notifInterval) clearInterval(this.notifInterval);
  }

  loadNotifications() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;
    this.messageService.getNotifications(userId).subscribe({
      next: (notifs) => {
        this.notifications.set(notifs);
        this.notifCount.set(notifs.length);
      },
    });
    // Aussi compter les messages non lus
    this.messageService.countNonLus(userId).subscribe({
      next: (count) => {
        this.notifCount.update((n) => n + count);
      },
    });
  }

  toggleNotifPanel() {
    this.showNotifPanel.update((v) => !v);
    this.showResults.set(false);
  }

  marquerTousLus() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;
    this.messageService.marquerTousLus(userId).subscribe({
      next: () => {
        this.notifications.set([]);
        this.notifCount.set(0);
        this.showNotifPanel.set(false);
      },
    });
  }

  // ... reste des méthodes inchangées
  onSearch(query: string) {
    this.searchQuery.set(query);
    if (query.trim().length < 2) {
      this.showResults.set(false);
      this.searchResults.set([]);
      return;
    }
    this.searchSubject.next(query);
  }

  selectResult(result: SearchResult) {
    this.router.navigate(result.route);
    this.clearSearch();
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showResults.set(false);
  }

  getTypeIcon(type: string) {
    switch (type) {
      case 'patient':
        return this.Users;
      case 'appointment':
        return this.Calendar;
      default:
        return this.FileText;
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'patient':
        return 'Patient';
      case 'appointment':
        return 'Rendez-vous';
      case 'prescription':
        return 'Prescription';
      default:
        return type;
    }
  }

  getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'patient':
        return 'bg-blue-100 text-blue-700';
      case 'appointment':
        return 'bg-green-100 text-green-700';
      case 'prescription':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getTypeIconColor(type: string): string {
    switch (type) {
      case 'patient':
        return '#2563eb';
      case 'appointment':
        return '#059669';
      default:
        return '#7c3aed';
    }
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showResults.set(false);
      this.showNotifPanel.set(false);
    }
  }
}
