export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

