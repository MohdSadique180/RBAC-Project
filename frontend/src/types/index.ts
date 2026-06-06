export type Role = 'USER' | 'ADMIN';

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface User {
  name: string;
  email: string;
  role: Role;
}

export interface ApiError {
  message?: string;
  status?: number;
  [key: string]: string | number | undefined;
}
