export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  actif: boolean;
}

export type Role = 'ADMIN' | 'MEDECIN' | 'SECRETAIRE';

export interface AuthResponse {
  token: string;
  role: Role;
  nom: string;
  id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: Role;
}
