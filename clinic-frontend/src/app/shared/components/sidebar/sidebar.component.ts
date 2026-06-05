import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Receipt,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronRight,
  UserCog,
  BarChart2,
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  readonly Receipt = Receipt;
  readonly MessageSquare = MessageSquare;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;
  readonly Stethoscope = Stethoscope;
  readonly ChevronRight = ChevronRight;
  readonly UserCog = UserCog;

  collapsed = signal(false);

  constructor(public authService: AuthService) {}

  toggle() {
    this.collapsed.update((v) => !v);
  }

  logout() {
    this.authService.logout();
  }

  navItems = [
    {
      label: 'Tableau de bord',
      route: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'MEDECIN', 'SECRETAIRE'],
    },
    {
      label: 'Patients',
      route: '/patients',
      icon: Users,
      roles: ['ADMIN', 'MEDECIN', 'SECRETAIRE'],
    },
    {
      label: 'Rendez-vous',
      route: '/appointments',
      icon: Calendar,
      roles: ['ADMIN', 'MEDECIN', 'SECRETAIRE'],
    },
    {
      label: 'Prescriptions',
      route: '/prescriptions',
      icon: FileText,
      roles: ['ADMIN', 'MEDECIN'],
    },
    {
      label: 'Facturation',
      route: '/billing',
      icon: Receipt,
      roles: ['ADMIN', 'SECRETAIRE'],
    },
    {
      label: 'Messagerie',
      route: '/messaging',
      icon: MessageSquare,
      roles: ['ADMIN', 'MEDECIN', 'SECRETAIRE'],
    },

    {
      label: 'Statistiques',
      route: '/stats',
      icon: BarChart2,
      roles: ['ADMIN'],
    },
    {
      label: 'Utilisateurs',
      route: '/admin/users',
      icon: UserCog,
      roles: ['ADMIN'],
    },
  ];

  get visibleItems() {
    const role = this.authService.userRole();
    return this.navItems.filter((item) =>
      role ? item.roles.includes(role) : false,
    );
  }
}
