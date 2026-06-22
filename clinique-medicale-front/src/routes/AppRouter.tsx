// src/routes/AppRouter.tsx

import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import LoginPage from "../presentation/pages/auth/LoginPage";
import LandingPage from "../presentation/pages/LandingPage";
import NotFoundPage from "../presentation/pages/NotFoundPage";

import AdminLayout from "../presentation/layouts/AdminLayout";
import AdminDashboardPage from "../presentation/pages/admin/DashboardPage";
import AdminPatientsPage from "../presentation/pages/admin/PatientsPage";
import AdminComptesPage from "../presentation/pages/admin/ComptesPage";
import AdminRendezVousPage from "../presentation/pages/admin/RendezVousPage";
import AdminPrescriptionsPage from "../presentation/pages/admin/PrescriptionsPage";
import AdminFacturationPage from "../presentation/pages/admin/FacturationPage";
import AdminChatPage from "../presentation/pages/admin/ChatPage";
import AdminStatistiquesPage from "../presentation/pages/admin/StatistiquesPage";

import MedecinLayout from "../presentation/layouts/MedecinLayout";
import MedecinDashboardPage from "../presentation/pages/medecin/DashboardPage";
import MedecinMesPatientsPage from "../presentation/pages/medecin/MesPatientsPage";
import MedecinRendezVousPage from "../presentation/pages/medecin/RendezVousPage";
import MedecinPrescriptionsPage from "../presentation/pages/medecin/PrescriptionsPage";
import MedecinChatPage from "../presentation/pages/medecin/ChatPage";

import SecretaireLayout from "../presentation/layouts/SecretaireLayout";
import SecretaireDashboardPage from "../presentation/pages/secretaire/DashboardPage";
import SecretairePatientsPage from "../presentation/pages/secretaire/PatientsPage";
import SecretaireRendezVousPage from "../presentation/pages/secretaire/RendezVousPage";
import SecretaireFacturationPage from "../presentation/pages/secretaire/FacturationPage";
import SecretaireChatPage from "../presentation/pages/secretaire/ChatPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="patients" element={<AdminPatientsPage />} />
        <Route path="rendez-vous" element={<AdminRendezVousPage />} />
        <Route path="prescriptions" element={<AdminPrescriptionsPage />} />
        <Route path="facturation" element={<AdminFacturationPage />} />
        <Route path="messagerie" element={<AdminChatPage />} />
        <Route path="statistiques" element={<AdminStatistiquesPage />} />
        <Route path="comptes" element={<AdminComptesPage />} />
      </Route>

      <Route
        path="/medecin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["MEDECIN"]}>
              <MedecinLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<MedecinDashboardPage />} />
        <Route path="mes-patients" element={<MedecinMesPatientsPage />} />
        <Route path="rendez-vous" element={<MedecinRendezVousPage />} />
        <Route path="prescriptions" element={<MedecinPrescriptionsPage />} />
        <Route path="messagerie" element={<MedecinChatPage />} />
      </Route>

      <Route
        path="/secretaire"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["SECRETAIRE"]}>
              <SecretaireLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SecretaireDashboardPage />} />
        <Route path="patients" element={<SecretairePatientsPage />} />
        <Route path="rendez-vous" element={<SecretaireRendezVousPage />} />
        <Route path="facturation" element={<SecretaireFacturationPage />} />
        <Route path="messagerie" element={<SecretaireChatPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
