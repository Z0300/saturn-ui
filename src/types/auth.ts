import type { User } from "./user";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  roles: string[];
  permissions: string[];
  setAuth: (data: TokenData) => void;
  clearAuth: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    createdAt: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
      createdAt: string;
    };
  };
}
