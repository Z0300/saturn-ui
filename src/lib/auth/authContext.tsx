import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { apiClient } from "./authClient";
import { authStore } from "./authStore";
import type { AuthProviderProps, AuthUser } from "@/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  // Accepts token + user returned by the API — does NOT call the API itself
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, try to restore session via refresh token cookie
  useEffect(() => {
    async function restoreSession() {
      try {
        const { data } = await apiClient.post("/api/auth/refresh");
        authStore.setToken(data.accessToken);
        setUser(data.user);
      } catch {
        // No valid refresh token — user must log in
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Pure state setter — the mutation handles the API call
  const login = useCallback((token: string, authUser: AuthUser) => {
    authStore.setToken(token);
    setUser(authUser);
    // Spring Boot sets the httpOnly refresh cookie automatically
  }, []);

  const logout = useCallback(async () => {
    await apiClient.post("/api/auth/logout");
    authStore.clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
