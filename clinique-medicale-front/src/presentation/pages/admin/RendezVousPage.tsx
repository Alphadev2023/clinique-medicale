// src/presentation/pages/admin/RendezVousPage.tsx

import { useState } from "react";
import { List, CalendarDays } from "lucide-react";
import { AppointmentsManager } from "../../components/AppointmentsManager";
import { CalendarView } from "../../components/CalendarView";

export default function RendezVousPage() {
  const [vue, setVue] = useState<"liste" | "calendrier">("calendrier");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Rendez-vous</h1>
        <div className="flex rounded-md border border-gray-300 p-1">
          <button
            onClick={() => setVue("calendrier")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium ${
              vue === "calendrier"
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Calendrier
          </button>
          <button
            onClick={() => setVue("liste")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium ${
              vue === "liste"
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <List className="h-4 w-4" />
            Liste
          </button>
        </div>
      </div>
      {vue === "calendrier" ? <CalendarView /> : <AppointmentsManager />}
    </div>
  );
}
