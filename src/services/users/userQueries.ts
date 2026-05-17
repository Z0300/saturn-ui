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

export const userKeys = {
  all: ["users"] as const,
  list: (search?: string, page = 0) => ["users", "list", search, page] as const,
  detail: (id: number) => ["users", id] as const,
};

export function useUsers(search?: string, page = 0, size = 10) {
  const { hasPermission } = useRbac();

  return useQuery({
    queryKey: userKeys.list(search, page),
    queryFn: () =>
      api
        .get<PaginatedResponse<UserSummary>>("/v1/users", {
          params: { search, page, size },
        })
        .then((r) => r.data.data),
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
