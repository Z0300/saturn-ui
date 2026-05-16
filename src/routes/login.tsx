import { LoginPage } from "#/features/auth/LoginPage";
import { useAuthStore } from "#/store/authStore";
import { isTokenExpired } from "#/utils/jwt";
import { getRedirectPath } from "#/utils/routeGuard";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const { accessToken, roles, permissions } = useAuthStore.getState();

    // Not logged in — stay on login page
    if (!accessToken || isTokenExpired(accessToken)) return;

    // ✅ Already logged in — redirect based on role
    throw redirect({ to: getRedirectPath(roles, permissions) });
  },
  component: LoginComponent,
});

function LoginComponent() {
  return <LoginPage />;
}
