// src/presentation/pages/admin/ComptesPage.tsx

import { useState } from "react";
import { Plus, Pencil, KeyRound } from "lucide-react";
import { useUsers } from "../../../application/users/useUsers";
import { useToggleUserActif } from "../../../application/users/useToggleUserActif";
import { useAuth } from "../../../application/auth/useAuth";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { Table } from "../../components/ui/Table";
import { CreateUserModal } from "../../components/CreateUserModal";
import { EditUserModal } from "../../components/EditUserModal";
import { ResetPasswordModal } from "../../components/ResetPasswordModal";
import { getNomComplet } from "../../../domain/user";
import type { User, Role } from "../../../domain/user";

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrateur",
  MEDECIN: "Médecin",
  SECRETAIRE: "Secrétaire",
};

const ROLE_BADGE_VARIANT: Record<Role, "primary" | "success" | "warning"> = {
  ADMIN: "primary",
  MEDECIN: "success",
  SECRETAIRE: "warning",
};

export default function ComptesPage() {
  const currentUser = useAuth((state) => state.user);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const { data: users, isLoading } = useUsers();
  const { mutate: toggleActif } = useToggleUserActif();

  function handleToggle(user: User) {
    const action = user.actif ? "désactiver" : "réactiver";
    if (
      window.confirm(
        `Voulez-vous ${action} le compte de ${getNomComplet(user)} ?`,
      )
    ) {
      toggleActif(user.id);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Comptes</h1>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Nouveau compte
        </Button>
      </div>

      {isLoading ? (
        <Spinner size={32} />
      ) : (
        <Table<User>
          data={users ?? []}
          keyExtractor={(u) => u.id}
          emptyMessage="Aucun compte"
          columns={[
            { header: "Nom", accessor: (u) => getNomComplet(u) },
            { header: "Email", accessor: (u) => u.email },
            {
              header: "Rôle",
              accessor: (u) => (
                <Badge variant={ROLE_BADGE_VARIANT[u.role]}>
                  {ROLE_LABELS[u.role]}
                </Badge>
              ),
            },
            {
              header: "Statut",
              accessor: (u) => (
                <Badge variant={u.actif ? "success" : "danger"}>
                  {u.actif ? "Actif" : "Désactivé"}
                </Badge>
              ),
            },
            {
              header: "Actions",
              accessor: (u) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    disabled={u.id === currentUser?.id}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Modifier"
                    title={
                      u.id === currentUser?.id
                        ? "Modifie ton profil depuis tes paramètres"
                        : "Modifier"
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setResettingUser(u)}
                    disabled={u.id === currentUser?.id}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-warning-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Réinitialiser le mot de passe"
                    title={
                      u.id === currentUser?.id
                        ? "Utilise le changement de mot de passe dans tes paramètres"
                        : "Réinitialiser le mot de passe"
                    }
                  >
                    <KeyRound className="h-4 w-4" />
                  </button>
                  <Button
                    variant={u.actif ? "danger" : "success"}
                    className="px-3 py-1 text-xs"
                    onClick={() => handleToggle(u)}
                    disabled={u.id === currentUser?.id}
                  >
                    {u.actif ? "Désactiver" : "Réactiver"}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EditUserModal
        isOpen={editingUser !== null}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />
      <ResetPasswordModal
        isOpen={resettingUser !== null}
        onClose={() => setResettingUser(null)}
        user={resettingUser}
      />
    </div>
  );
}
