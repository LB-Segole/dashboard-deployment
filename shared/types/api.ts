/**
 * API Response Type Definitions
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ListQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, unknown>;
  search?: string;
}