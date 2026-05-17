import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { permissionKeys } from "./permissionQueries";
import type { CreatePermissionRequest, UpdatePermissionRequest } from "@/types";

export function useCreatePermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePermissionRequest) =>
      api.post("/v1/permissions", data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.all });
    },
  });
}

export function useUpdatePermissionMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePermissionRequest) =>
      api.patch(`/v1/permissions/${id}`, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.all });
    },
  });
}

export function useDeletePermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/v1/permissions/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.all });
    },
  });
}
