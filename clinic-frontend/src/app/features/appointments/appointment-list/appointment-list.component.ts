import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment.model';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { fadeInUp, listAnimation } from '../../../shared/animations/animations';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { AuthService } from '../../../core/services/auth.service';
import {
  LucideAngularModule,
  CalendarPlus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Eye,
  Check,
  X,
  LayoutGrid,
  List,
} from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule,
    AppointmentFormComponent,
    PaginationComponent,
  ],
  animations: [fadeInUp, listAnimation],
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent implements OnInit {
  readonly CalendarPlus = CalendarPlus;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Filter = Filter;
  readonly Eye = Eye;
  readonly Check = Check;
  readonly X = X;
  readonly LayoutGrid = LayoutGrid;
  readonly List = List;

  appointments = signal<Appointment[]>([]);
  filtered = signal<Appointment[]>([]);
  loading = signal(true);
  showForm = signal(false);
  filterStatus = signal('TOUS');
  currentPage = signal(1);
  pageSize = signal(10);

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading.set(true);
    const role = this.authService.userRole();
    const userId = this.authService.currentUser()?.id;

    if (role === 'MEDECIN' && userId) {
      this.appointmentService.listerParMedecin(userId).subscribe({
        next: (data) => {
          this.appointments.set(data);
          this.applyFilter(this.filterStatus());
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.appointmentService.listerTous().subscribe({
        next: (data) => {
          this.appointments.set(data);
          this.applyFilter(this.filterStatus());
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  confirmer(id: string) {
    this.appointmentService.confirmer(id).subscribe({
      next: () => this.loadAppointments(),
    });
  }

  annuler(id: string) {
    if (confirm('Voulez-vous annuler ce rendez-vous ?')) {
      this.appointmentService.annuler(id).subscribe({
        next: () => this.loadAppointments(),
      });
    }
  }

  terminer(id: string) {
    this.appointmentService.terminer(id).subscribe({
      next: () => this.loadAppointments(),
    });
  }

  onSaved() {
    this.showForm.set(false);
    this.loadAppointments();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLANIFIE':
        return 'badge-info';
      case 'CONFIRME':
        return 'badge-success';
      case 'TERMINE':
        return 'bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full';
      case 'ANNULE':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PLANIFIE':
        return 'Planifié';
      case 'CONFIRME':
        return 'Confirmé';
      case 'TERMINE':
        return 'Terminé';
      case 'ANNULE':
        return 'Annulé';
      default:
        return status;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  countByStatus(status: string): number {
    return this.appointments().filter((a) => a.status === status).length;
  }

  get filteredAll(): Appointment[] {
    if (this.filterStatus() === 'TOUS') return this.appointments();
    return this.appointments().filter((a) => a.status === this.filterStatus());
  }

  get paginatedAppointments(): Appointment[] {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredAll.slice(start, start + this.pageSize());
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }
  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  applyFilter(status: string) {
    this.filterStatus.set(status);
    this.currentPage.set(1); // ← reset page sur filtre
  }
}
