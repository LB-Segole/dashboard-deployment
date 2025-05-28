import { Request } from 'express';
import { User } from '../types/user';

export interface ContextData {
  userId?: string;
  user?: User;
  requestId: string;
  startTime: number;
  correlationId?: string;
  clientIp?: string;
  userAgent?: string;
}

export interface RequestWithContext extends Request {
  context: ContextData;
}

export interface ContextOptions {
  includeUser?: boolean;
  correlationIdHeader?: string;
} 