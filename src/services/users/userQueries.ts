import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRbac } from "@/hooks/useRbac";
import { Permissions } from "@/constants/permissions";
import type {
  User,
  UserSummary,
  PaginatedResponse,
  SingleResponse,
} from "@/types";
import type { UsersFilterRequest } from "@/types/user";

export const userKeys = {
  all: ["users"] as const,
  list: (filters?: UsersFilterRequest) => ["users", "list", filters] as const,
  detail: (id: number) => ["users", id] as const,
};

export function useUsers(filters?: UsersFilterRequest) {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () =>
      api
        .get<PaginatedResponse<UserSummary>>("/v1/users", { params: filters })
        .then((r) => r.data),
    enabled: hasPermission(Permissions.USERS_READ),
  });
}

export function useUser(id: number) {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () =>
      api.get<SingleResponse<User>>(`/v1/users/${id}`).then((r) => r.data.data),
    enabled: !!id && hasPermission(Permissions.USERS_READ),
  });
}
