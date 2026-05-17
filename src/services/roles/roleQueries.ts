import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRbac } from "@/hooks/useRbac";
import { Permissions } from "@/constants/permissions";
import type { Role, SingleResponse } from "@/types";

export const roleKeys = {
  all: ["roles"] as const,
  list: () => ["roles", "list"] as const,
  detail: (id: number) => ["roles", id] as const,
};

export function useRoles() {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: () =>
      api.get<{ data: Role[] }>("/v1/roles").then((r) => r.data.data),
    enabled: hasPermission(Permissions.ROLES_READ),
  });
}

export function useRole(id: number) {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () =>
      api.get<SingleResponse<Role>>(`/v1/roles/${id}`).then((r) => r.data.data),
    enabled: !!id && hasPermission(Permissions.ROLES_READ),
  });
}
