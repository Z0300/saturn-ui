import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRbac } from "@/hooks/useRbac";
import { Permissions } from "@/constants/permissions";
import type { PaginatedResponse, Permission, SingleResponse } from "@/types";
import type { PermissionsFilterRequest } from "#/types/permission";

export const permissionKeys = {
  all: ["permissions"] as const,
  list: (filters?: PermissionsFilterRequest) => ["permissions", "list", filters] as const,
  detail: (id: number) => ["permissions", id] as const,
};

export function usePermissions(filters?: PermissionsFilterRequest) {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: permissionKeys.list(filters),
    queryFn: () =>
      api.get<PaginatedResponse<Permission>>("/v1/permissions", {params: filters}).then((r) => r.data),
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
