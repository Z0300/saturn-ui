import { useAuthStore } from '../store/authStore'

export function useRbac() {
  const { roles, permissions } = useAuthStore()

  const hasRole = (role: string): boolean =>
    roles.includes(role)

  const hasAnyRole = (...requiredRoles: string[]): boolean =>
    requiredRoles.some(r => roles.includes(r))

  const hasAllRoles = (...requiredRoles: string[]): boolean =>
    requiredRoles.every(r => roles.includes(r))

  const hasPermission = (permission: string): boolean =>
    permissions.includes(permission)

  const hasAnyPermission = (...requiredPerms: string[]): boolean =>
    requiredPerms.some(p => permissions.includes(p))

  const hasAllPermissions = (...requiredPerms: string[]): boolean =>
    requiredPerms.every(p => permissions.includes(p))

  const isSuperAdmin = (): boolean =>
    hasRole('SUPER_ADMIN')

  return {
    roles,
    permissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin,
  }
}