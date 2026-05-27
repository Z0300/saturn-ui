import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { Roles } from "@/constants/permissions";

export function requirePermission(permission: string) {
  const { permissions } = useAuthStore.getState();

  if (!permissions.includes(permission)) {
    throw redirect({ to: "/unauthorized" });
  }
}

export function requireRole(role: string) {
  const { roles } = useAuthStore.getState();

  if (!roles.includes(role)) {
    throw redirect({ to: "/unauthorized" });
  }
}

export function requireAnyRole(...requiredRoles: string[]) {
  const { roles } = useAuthStore.getState();

  if (!requiredRoles.some((r) => roles.includes(r))) {
    throw redirect({ to: "/unauthorized" });
  }
}

export function getRedirectPath(
  roles: string[],
  _permissions: string[],
): string {
  if (roles.includes(Roles.SUPER_ADMIN)) return "/users";
  if (roles.includes(Roles.ADMIN)) return "/users";
  return "/";
}
