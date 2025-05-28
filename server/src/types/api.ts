export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d';