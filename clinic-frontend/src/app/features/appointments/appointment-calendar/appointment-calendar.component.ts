import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment.model';
import { LucideAngularModule, Calendar, List } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointment-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, LucideAngularModule, RouterLink],
  templateUrl: './appointment-calendar.component.html',
})
export class AppointmentCalendarComponent implements OnInit {
  readonly Calendar = Calendar;
  readonly List = List;

  loading = signal(true);
  selectedEvent = signal<Appointment | null>(null);
  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    height: 'auto',
    events: [],
    eventClick: (info: EventClickArg) => this.onEventClick(info),
    eventColor: '#2563eb',
  });

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.appointmentService.listerTous().subscribe({
      next: (appointments) => {
        const events = appointments.map((a) => ({
          id: a.id,
          title: a.motif || 'Consultation',
          start: a.debut,
          end: a.fin,
          backgroundColor: this.getColor(a.status),
          borderColor: this.getColor(a.status),
          extendedProps: { appointment: a },
        }));

        this.calendarOptions.update((opts) => ({
          ...opts,
          events,
        }));
        this.loading.set(false);
      },
    });
  }

  onEventClick(info: EventClickArg) {
    this.selectedEvent.set(
      info.event.extendedProps['appointment'] as Appointment,
    );
  }

  closeDetail() {
    this.selectedEvent.set(null);
  }

  getColor(status: string): string {
    switch (status) {
      case 'PLANIFIE':
        return '#2563eb';
      case 'CONFIRME':
        return '#059669';
      case 'TERMINE':
        return '#6b7280';
      case 'ANNULE':
        return '#dc2626';
      default:
        return '#2563eb';
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
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
