import { Permissions, Roles } from "#/constants/permissions";

export function getRedirectPath(roles: string[], permissions: string[]): string {
  // Highest privilege first
  if (roles.includes(Roles.SUPER_ADMIN)) {
    return '/users'             // ← full access, go to user management
  }

  if (roles.includes(Roles.ADMIN)) {
    return '/users'             // ← admin sees users too
  }

  if (roles.includes(Roles.MODERATOR)) {
    return '/dashboard'         // ← moderator goes to dashboard
  }

  // Regular user — only has profile access
  if (permissions.includes(Permissions.PROFILE_READ)) {
    return '/dashboard'
  }

  // Fallback
  return '/dashboard'
}