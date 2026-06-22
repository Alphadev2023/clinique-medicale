// src/presentation/components/CalendarView.tsx

import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import { useAppointments } from "../../application/appointments/useAppointments";
import { usePatients } from "../../application/patients/usePatients";
import { useMedecins } from "../../application/users/useMedecins";
import { useAuth } from "../../application/auth/useAuth";
import { Select } from "./ui/Select";
import { AppointmentFormModal } from "./AppointmentFormModal";
import { AppointmentDetailModal } from "./AppointmentDetailModal";
import { getNomComplet as getNomCompletPatient } from "../../domain/patient";
import { getNomComplet as getNomCompletUser } from "../../domain/user";
import type { Appointment, AppointmentStatus } from "../../domain/appointment";

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  PLANIFIE: "#2563eb",
  CONFIRME: "#16a34a",
  TERMINE: "#9ca3af",
  ANNULE: "#dc2626",
};

function toDatetimeLocalInput(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function CalendarView() {
  const user = useAuth((state) => state.user);
  const isMedecin = user?.role === "MEDECIN";

  const [medecinFiltre, setMedecinFiltre] = useState(
    isMedecin ? (user?.id ?? "") : "",
  );
  const [salleFiltre, setSalleFiltre] = useState("");
  const [detailAppointment, setDetailAppointment] =
    useState<Appointment | null>(null);
  const [creationSlot, setCreationSlot] = useState<{
    debut: string;
    fin: string;
  } | null>(null);

  const { data: appointments, isLoading } = useAppointments(
    isMedecin ? user?.id : undefined,
  );
  const { data: patients } = usePatients();
  const { data: medecins } = useMedecins();

  const patientNom = (id: string) => {
    const patient = patients?.find((p) => p.id === id);
    return patient ? getNomCompletPatient(patient) : "Patient supprimé";
  };

  const medecinOptions = (medecins ?? []).map((m) => ({
    value: m.id,
    label: getNomCompletUser(m),
  }));

  const sallesDisponibles = useMemo(() => {
    const salles = new Set(
      (appointments ?? []).filter((a) => a.salle).map((a) => a.salle as string),
    );
    return Array.from(salles).map((s) => ({ value: s, label: s }));
  }, [appointments]);

  const appointmentsFiltres = useMemo(() => {
    return (appointments ?? []).filter((a) => {
      if (medecinFiltre && a.medecinId !== medecinFiltre) return false;
      if (salleFiltre && a.salle !== salleFiltre) return false;
      return true;
    });
  }, [appointments, medecinFiltre, salleFiltre]);

  const events = appointmentsFiltres.map((a) => ({
    id: a.id,
    title: `${patientNom(a.patientId)}${a.motif ? " — " + a.motif : ""}`,
    start: a.debut,
    end: a.fin,
    backgroundColor: STATUS_COLORS[a.status],
    borderColor: STATUS_COLORS[a.status],
    extendedProps: { appointment: a },
  }));

  function handleEventClick(info: EventClickArg) {
    setDetailAppointment(info.event.extendedProps.appointment as Appointment);
  }

  function handleSelect(info: DateSelectArg) {
    setCreationSlot({
      debut: toDatetimeLocalInput(info.startStr),
      fin: toDatetimeLocalInput(info.endStr),
    });
  }

  if (isLoading) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        Chargement du calendrier...
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {!isMedecin && (
          <div className="w-56">
            <Select
              options={medecinOptions}
              placeholder="Tous les médecins"
              value={medecinFiltre}
              onChange={(e) => setMedecinFiltre(e.target.value)}
            />
          </div>
        )}
        <div className="w-56">
          <Select
            options={sallesDisponibles}
            placeholder="Toutes les salles"
            value={salleFiltre}
            onChange={(e) => setSalleFiltre(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="timeGridWeek"
          locale={frLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          height="auto"
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          selectable
          select={handleSelect}
          events={events}
          eventClick={handleEventClick}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>

      <AppointmentDetailModal
        appointment={detailAppointment}
        onClose={() => setDetailAppointment(null)}
      />

      <AppointmentFormModal
        isOpen={creationSlot !== null}
        onClose={() => setCreationSlot(null)}
        defaultDebut={creationSlot?.debut}
        defaultFin={creationSlot?.fin}
      />
    </div>
  );
}
