// src/presentation/components/ResetPasswordModal.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useResetPassword } from "../../application/users/useResetPassword";
import { getErrorMessage } from "../../infrastructure/apiClient";
import { getNomComplet } from "../../domain/user";
import type { User } from "../../domain/user";

const resetPasswordSchema = z
  .object({
    nouveauMotDePasse: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmation: z.string().min(1, "Confirmation requise"),
  })
  .refine((values) => values.nouveauMotDePasse === values.confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmation"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  user,
}: ResetPasswordModalProps) {
  const {
    mutate: reinitialiser,
    isPending,
    error,
    reset: resetMutation,
  } = useResetPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function handleClose() {
    reset();
    resetMutation();
    onClose();
  }

  function onSubmit(values: ResetPasswordFormValues) {
    if (!user) return;
    reinitialiser(
      { id: user.id, payload: { nouveauMotDePasse: values.nouveauMotDePasse } },
      { onSuccess: handleClose },
    );
  }

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Réinitialiser le mot de passe — ${getNomComplet(user)}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-600">
          Communique ce nouveau mot de passe à {getNomComplet(user)} par un
          autre moyen (téléphone, en personne) — il ne sera affiché qu'une seule
          fois.
        </p>
        <Input
          label="Nouveau mot de passe"
          type="password"
          required
          error={errors.nouveauMotDePasse?.message}
          {...register("nouveauMotDePasse")}
        />
        <Input
          label="Confirmer le mot de passe"
          type="password"
          required
          error={errors.confirmation?.message}
          {...register("confirmation")}
        />
        {error && (
          <p className="text-sm text-danger-600">{getErrorMessage(error)}</p>
        )}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" isLoading={isPending}>
            Réinitialiser
          </Button>
        </div>
      </form>
    </Modal>
  );
}
