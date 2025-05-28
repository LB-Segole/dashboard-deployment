import { Request, Response, NextFunction } from 'express';
// import { User } from '@prisma/client';

// Define a compatible User type for AuthenticatedRequest
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin' | 'superadmin';
  email_verified: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export type AsyncHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface ErrorResponse {
  statusCode: number;
  message: string;
  code?: string;
  details?: unknown;
}

export interface RequestValidationSchema {
  params?: unknown;
  body?: unknown;
  query?: unknown;
}