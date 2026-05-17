import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type { AuthResponse } from "@/types/auth";
import type { LoginRequest, RegisterRequest } from "@/types/auth";
import { getRedirectPath } from "@/utils/routeGuard";

export function useLoginMutation(redirectTo?: string) {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      api.post<AuthResponse>("/v1/auth/login", credentials).then((r) => r.data),

    onSuccess: (response) => {
      setAuth(response.data);
      const { roles, permissions } = useAuthStore.getState();

      navigate({ to: redirectTo ?? getRedirectPath(roles, permissions) });
    },
  });
}

export function useRegisterMutation() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      api.post<AuthResponse>("/v1/auth/register", data).then((r) => r.data),

    onSuccess: (response) => {
      setAuth(response.data);
      navigate({ to: "/" });
    },
  });
}

export function useLogoutMutation() {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post("/v1/auth/logout").then((r) => r.data),
    onSettled: () => {
      queryClient.clear();
      clearAuth();
      window.location.href = "/login";
    },
  });
}

export function useRefreshMutation() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (refreshToken: string) =>
      api
        .post<AuthResponse>("/v1/auth/refresh", { refreshToken })
        .then((r) => r.data),

    onSuccess: (response) => {
      setAuth(response.data);
    },
  });
}
