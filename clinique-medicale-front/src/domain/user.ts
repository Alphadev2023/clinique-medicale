// src/domain/user.ts

export type Role = "ADMIN" | "MEDECIN" | "SECRETAIRE";

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  actif: boolean;
}

/**
 * Forme minimale renvoyée par /api/auth/login et /api/auth/register.
 * Ne contient ni prenom, ni email, ni actif.
 */
export interface AuthResponse {
  token: string;
  role: Role;
  nom: string;
  id: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: Role;
}

export interface UpdateProfilePayload {
  nom: string;
  prenom: string;
}

export interface ChangePasswordPayload {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

export interface UpdateUserPayload {
  nom: string;
  prenom: string;
  email: string;
  role: Role;
}

export function getNomComplet(user: Pick<User, "nom" | "prenom">): string {
  return `${user.prenom} ${user.nom}`;
}

export function hasRole(user: Pick<User, "role">, ...roles: Role[]): boolean {
  return roles.includes(user.role);
}

export interface ResetPasswordPayload {
  nouveauMotDePasse: string;
}
