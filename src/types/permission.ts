// types/permission.ts
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
  name?: string;
  description?: string;
}

// API response shapes
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
