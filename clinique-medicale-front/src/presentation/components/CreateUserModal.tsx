// src/presentation/components/CreateUserModal.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { useCreateUser } from "../../application/users/useCreateUser";
import { getErrorMessage } from "../../infrastructure/apiClient";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Administrateur" },
  { value: "MEDECIN", label: "Médecin" },
  { value: "SECRETAIRE", label: "Secrétaire" },
];

const createUserSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  email: z.string().min(1, "Email requis").email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["ADMIN", "MEDECIN", "SECRETAIRE"], { message: "Rôle requis" }),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const { mutate: creer, isPending, error } = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
  });

  function onSubmit(values: CreateUserFormValues) {
    creer(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouveau compte">
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
        <Input
          label="Mot de passe"
          type="password"
          required
          error={errors.password?.message}
          {...register("password")}
        />
        <Select
          label="Rôle"
          required
          options={ROLE_OPTIONS}
          placeholder="Sélectionner un rôle"
          error={errors.role?.message}
          {...register("role")}
        />
        <Select
          label="Rôle"
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
            Créer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
