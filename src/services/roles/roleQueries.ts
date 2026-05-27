import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRbac } from "@/hooks/useRbac";
import { Permissions } from "@/constants/permissions";
import type { PaginatedResponse, Role, SingleResponse } from "@/types";
import type { RolesFilterRequest } from "@/types/role";
import { getRole } from "./roleService";

export const roleKeys = {
  all: ["roles"] as const,
  list: (filters?: RolesFilterRequest) => ["roles", "list", filters] as const,
  detail: (id: number) => ["roles", id] as const,
};

export function useRoles(filters?: RolesFilterRequest) {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: roleKeys.list(filters),
    queryFn: () =>
      api
        .get<PaginatedResponse<Role>>("/v1/roles", { params: filters })
        .then((r) => r.data),
    enabled: hasPermission(Permissions.ROLES_READ),
  });
}

export function useRole(id: number) {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => getRole(id),
    enabled: !!id && hasPermission(Permissions.ROLES_READ),
  });
}
