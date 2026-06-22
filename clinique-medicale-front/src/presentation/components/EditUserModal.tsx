// src/presentation/components/EditUserModal.tsx

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { useUpdateUser } from "../../application/users/useUpdateUser";
import { getErrorMessage } from "../../infrastructure/apiClient";
import type { User } from "../../domain/user";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Administrateur" },
  { value: "MEDECIN", label: "Médecin" },
  { value: "SECRETAIRE", label: "Secrétaire" },
];

const editUserSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  email: z.string().min(1, "Email requis").email("Email invalide"),
  role: z.enum(["ADMIN", "MEDECIN", "SECRETAIRE"], { message: "Rôle requis" }),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const { mutate: modifier, isPending, error } = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      });
    }
  }, [user, reset]);

  function onSubmit(values: EditUserFormValues) {
    if (!user) return;
    modifier({ id: user.id, payload: values }, { onSuccess: onClose });
  }

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier le compte">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nom"
          required
          error={errors.nom?.message}
          {...register("nom")}
        />
        <Input
          label="Prénom"
          required
          error={errors.prenom?.message}
          {...register("prenom")}
        />
        <Input
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <Select
          label="Rôle"
          required
          options={ROLE_OPTIONS}
          placeholder="Sélectionner un rôle"
          error={errors.role?.message}
          {...register("role")}
        />
        {error && (
          <p className="text-sm text-danger-600">{getErrorMessage(error)}</p>
        )}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
