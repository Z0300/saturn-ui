export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
