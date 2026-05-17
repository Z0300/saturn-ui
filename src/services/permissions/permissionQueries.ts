import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRbac } from "@/hooks/useRbac";
import { Permissions } from "@/constants/permissions";
import type { Permission, SingleResponse } from "@/types";

export const permissionKeys = {
  all: ["permissions"] as const,
  list: () => ["permissions", "list"] as const,
  detail: (id: number) => ["permissions", id] as const,
};

export function usePermissions() {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: () =>
      api
        .get<{ data: Permission[] }>("/v1/permissions")
        .then((r) => r.data.data),
    enabled: hasPermission(Permissions.PERMISSIONS_READ),
  });
}

export function usePermission(id: number) {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: permissionKeys.detail(id),
    queryFn: () =>
      api
        .get<SingleResponse<Permission>>(`/v1/permissions/${id}`)
        .then((r) => r.data.data),
    enabled: !!id && hasPermission(Permissions.PERMISSIONS_READ),
  });
}
