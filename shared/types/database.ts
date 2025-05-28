/**
 * Database Model Type Definitions
 */

export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface SoftDeleteModel extends BaseModel {
  isDeleted: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: Record<string, 1 | -1>;
}

export interface QueryOptions<T> {
  where?: Partial<T>;
  select?: Record<string, boolean>;
  relations?: string[];
}

export type DatabaseResult<T> = {
  data: T | null;
  error?: Error;
};