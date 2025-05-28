export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  creditLimit: number;
  creditsUsed: number;
  callsCount: number;
  totalSpent: number;
  lastLoginAt?: string;
  createdAt: string;
} 