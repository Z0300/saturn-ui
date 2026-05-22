import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { roleKeys } from "./roleQueries"
import { toast } from "sonner"
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from "@/types"

export function useCreateRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoleRequest) =>
      api.post("/v1/roles", data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      toast.success("Role created successfully")
    },
  })
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateRoleRequest) =>
      api.patch(`/v1/roles/${data.id}`, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      toast.success("Role updated successfully")
    },
  })
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/v1/roles/${id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      toast.success("Role deleted successfully")
    },
  })
}

export function useAssignPermissionsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: number; data: AssignPermissionsRequest }) =>
      api.put(`/v1/roles/${roleId}/permissions`, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all })
      toast.success("Permissions assigned successfully")
    },
  })
}