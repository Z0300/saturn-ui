export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface CreatePermissionRequest {
  name: string;
  description: string;
}

export interface UpdatePermissionRequest {
  id: number;
  name?: string;
  description?: string;
}

export interface PermissionsFilterRequest {
  page?: number;
  size?: number;
  search?: string;
}

