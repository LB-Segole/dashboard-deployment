export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'agent';
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  settings?: Record<string, unknown>;
} 