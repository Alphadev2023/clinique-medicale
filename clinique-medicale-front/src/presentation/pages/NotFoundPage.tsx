// src/presentation/pages/NotFoundPage.tsx

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">Page introuvable</h1>
      <Link to="/login" className="text-primary-600 underline">
        Retour à la connexion
      </Link>
    </div>
  );
}
