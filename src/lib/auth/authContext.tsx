import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { apiClient } from "./authClient";
import { authStore } from "./authStore";
import type { AuthUser } from "@/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post("/api/auth/login", {
      email,
      password,
    });
    authStore.setToken(data.accessToken);
    setUser(data.user);
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
