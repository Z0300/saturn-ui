import type { Permission } from "./permission";

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
}

export interface AssignPermissionsRequest {
  permissionIds: number[];
}
