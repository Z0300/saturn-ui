import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { userKeys } from "./userQueries";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  AssignRolesRequest,
} from "@/types";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) =>
      api.post("/v1/users", data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUserMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) =>
      api.patch(`/v1/users/${id}`, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/v1/users/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useAssignRolesMutation(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignRolesRequest) =>
      api.put(`/v1/users/${userId}/roles`, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
