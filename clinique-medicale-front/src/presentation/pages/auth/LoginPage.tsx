// src/presentation/pages/auth/LoginPage.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../../application/auth/useLogin";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { getErrorMessage } from "../../../infrastructure/apiClient";
import type { Role } from "../../../domain/user";

const loginSchema = z.object({
  email: z.string().min(1, "Email requis").email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DASHBOARD_PAR_ROLE: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  MEDECIN: "/medecin/dashboard",
  SECRETAIRE: "/secretaire/dashboard",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: LoginFormValues) {
    login(values, {
      onSuccess: (user) => {
        navigate(DASHBOARD_PAR_ROLE[user.role]);
      },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <h1 className="mb-6 text-xl font-semibold text-gray-900">Connexion</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {error && (
            <p className="text-sm text-danger-600">{getErrorMessage(error)}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            className="w-full"
          >
            Se connecter
          </Button>
        </form>
      </Card>
    </div>
  );
}
