import { useRbac } from "#/hooks/useRbac";

interface CanProps {
  permission?: string;
  role?: string;
  anyPermission?: string[];
  anyRole?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Can({
  permission,
  role,
  anyPermission,
  anyRole,
  fallback = null,
  children,
}: CanProps) {
  const { hasPermission, hasRole, hasAnyPermission, hasAnyRole } = useRbac();

  const allowed =
    (permission ? hasPermission(permission) : true) &&
    (role ? hasRole(role) : true) &&
    (anyPermission ? hasAnyPermission(...anyPermission) : true) &&
    (anyRole ? hasAnyRole(...anyRole) : true);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
