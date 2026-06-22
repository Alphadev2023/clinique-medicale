// src/presentation/components/PaymentModal.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useRegisterPayment } from "../../application/billing/useRegisterPayment";
import { getErrorMessage } from "../../infrastructure/apiClient";
import type { Invoice } from "../../domain/billing";

const paymentFormSchema = z.object({
  montant: z.number().min(1, "Le montant doit être supérieur à 0"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function PaymentModal({ isOpen, onClose, invoice }: PaymentModalProps) {
  const { mutate: payer, isPending, error } = useRegisterPayment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
  });

  function onSubmit(values: PaymentFormValues) {
    if (!invoice) return;
    payer(
      { id: invoice.id, montant: values.montant },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  }

  if (!invoice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enregistrer un paiement">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-600">
          Montant restant dû :{" "}
          <span className="font-semibold text-gray-900">
            {invoice.montantRestant.toLocaleString("fr-FR")} FCFA
          </span>
        </p>
        <Input
          label="Montant payé"
          type="number"
          min={1}
          step="0.01"
          required
          error={errors.montant?.message}
          {...register("montant", { valueAsNumber: true })}
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
