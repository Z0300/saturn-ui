import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { roleKeys } from "./roleQueries";
import { toast } from "sonner";
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from "@/types";
import { useState } from "react";

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) =>
      api.post("/v1/roles", data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      toast.success("Role created successfully");
    },
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoleRequest) =>
      api.patch(`/v1/roles/${data.id}`, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      toast.success("Role updated successfully");
    },
  });
}

export function useAssignPermissionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      data,
    }: {
      roleId: number;
      data: AssignPermissionsRequest;
    }) =>
      api.put(`/v1/roles/${roleId}/permissions`, data).then((r) => r.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      toast.success("Permissions assigned successfully");
    },
  });
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: (id: number) => api.delete(`/v1/roles/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.all,
      });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? "Something went wrong";
      setErrorMessage(msg);
      setIsErrorOpen(true);
    },
  });
  return {
    ...mutation,
    isErrorOpen,
    setIsErrorOpen,
    errorMessage,
  };
}
