// src/presentation/components/AppointmentFormModal.tsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { useCreateAppointment } from "../../application/appointments/useCreateAppointment";
import { usePatients } from "../../application/patients/usePatients";
import { useMedecins } from "../../application/users/useMedecins";
import { useAuth } from "../../application/auth/useAuth";
import { getErrorMessage } from "../../infrastructure/apiClient";
import { getNomComplet as getNomCompletPatient } from "../../domain/patient";
import { getNomComplet as getNomCompletUser } from "../../domain/user";

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Patient requis"),
  medecinId: z.string().min(1, "Médecin requis"),
  debut: z
    .string()
    .min(1, "Date de début requise")
    .refine((val) => new Date(val) > new Date(), {
      message: "La date de début doit être dans le futur",
    }),
  fin: z.string().min(1, "Date de fin requise"),
  motif: z.string().optional(),
  salle: z.string().optional(),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDebut?: string;
  defaultFin?: string;
}

export function AppointmentFormModal({
  isOpen,
  onClose,
  defaultDebut,
  defaultFin,
}: AppointmentFormModalProps) {
  const currentUser = useAuth((state) => state.user);
  const isMedecin = currentUser?.role === "MEDECIN";

  const { data: patients } = usePatients();
  const { data: medecins } = useMedecins();
  const { mutate: creer, isPending, error } = useCreateAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      medecinId: isMedecin && currentUser ? currentUser.id : "",
      debut: defaultDebut ?? "",
      fin: defaultFin ?? "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        patientId: "",
        medecinId: isMedecin && currentUser ? currentUser.id : "",
        debut: defaultDebut ?? "",
        fin: defaultFin ?? "",
        motif: "",
        salle: "",
        notes: "",
      });
    }
  }, [isOpen, defaultDebut, defaultFin, isMedecin, currentUser, reset]);

  function onSubmit(values: AppointmentFormValues) {
    creer(
      {
        patientId: values.patientId,
        medecinId: values.medecinId,
        debut: values.debut,
        fin: values.fin,
        motif: values.motif || undefined,
        salle: values.salle || undefined,
        notes: values.notes || undefined,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  }

  const patientOptions = (patients ?? []).map((p) => ({
    value: p.id,
    label: getNomCompletPatient(p),
  }));
  const medecinOptions = (medecins ?? []).map((m) => ({
    value: m.id,
    label: getNomCompletUser(m),
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouveau rendez-vous">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Patient"
          required
          options={patientOptions}
          placeholder="Sélectionner un patient"
          error={errors.patientId?.message}
          {...register("patientId")}
        />
        <Select
          label="Médecin"
          required
          options={medecinOptions}
          placeholder="Sélectionner un médecin"
          error={errors.medecinId?.message}
          disabled={isMedecin}
          {...register("medecinId")}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Début"
            type="datetime-local"
            required
            min={new Date().toISOString().slice(0, 16)}
            error={errors.debut?.message}
            {...register("debut")}
          />
          <Input
            label="Fin"
            type="datetime-local"
            required
            error={errors.fin?.message}
            {...register("fin")}
          />
        </div>
        <Input label="Motif" {...register("motif")} />
        <Input label="Salle" {...register("salle")} />
        <Input label="Notes" {...register("notes")} />
        {error && (
          <p className="text-sm text-danger-600">{getErrorMessage(error)}</p>
        )}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Créer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
