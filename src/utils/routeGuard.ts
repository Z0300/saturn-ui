import { redirect } from "@tanstack/react-router";
import { Roles } from "@/constants/permissions";
import type { AuthState } from "#/types";

export function requirePermission(permission: string) {
  return ({ context }: { context: { auth: AuthState } }) => {
    const { permissions, roles } = context.auth;

    if (roles.includes(Roles.SUPER_ADMIN)) return;

    if (!permissions.includes(permission)) {
      throw redirect({ to: "/unauthorized" });
    }
  };
}

export function requireRole(role: string) {
  return ({ context }: { context: { auth: AuthState } }) => {
    const { roles } = context.auth;

    if (!roles.includes(role)) {
      throw redirect({ to: "/unauthorized" });
    }
  };
}

export function requireAnyRole(...requiredRoles: string[]) {
  return ({ context }: { context: { auth: AuthState } }) => {
    const { roles } = context.auth;

    if (!requiredRoles.some((r) => roles.includes(r))) {
      throw redirect({ to: "/unauthorized" });
    }
  };
}

export function getRedirectPath(
  roles: string[],
  permissions: string[],
): string {
  if (roles.includes(Roles.SUPER_ADMIN)) return "/users";
  if (roles.includes(Roles.ADMIN)) return "/users";
  return "/";
}
