export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

export interface AuthProviderProps {
  children: React.ReactNode;
  onAuthChange?: (user: AuthUser | null, isLoading: boolean) => void; // ← add
}
