// types/admin.ts
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'manager';
  status: 'active' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SystemSettings {
  general: {
    siteName: string;
    maxConcurrentCalls: number;
    callTimeout: number;
    recordingEnabled: boolean;
    analyticsEnabled: boolean;
  };
  api: {
    rateLimit: number;
    maxRequestSize: string;
    timeout: number;
    retryAttempts: number;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireMFA: boolean;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
    }
  };
  notifications: {
    emailEnabled: boolean;
    slackEnabled: boolean;
    webhookUrl?: string;
  };
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'maintenance';
  createdAt: string;
  updatedAt?: string;
  config: AgentConfig;
}

export interface AgentConfig {
  agentId: string;
  name: string;
  voiceModel: string;
  speechRate: number;
  pitch: number;
  language: string;
  voice: 'neutral' | 'male' | 'female';
  initialMessage: string;
  fallbackMessage?: string;
  interruptionThreshold: number;
  sentimentAnalysis: boolean;
  endCallKeywords?: string[];
  enableInterruptions: boolean;
  enableSentimentAnalysis: boolean;
  enableCallRecording: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending';
  creditLimit: number;
  subscriptionPlan: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'agent' | 'user';

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  service: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface SystemStatus {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
  activeCalls: number;
  totalAgents: number;
  activeAgents: number;
  databaseStatus: 'ok' | 'slow' | 'degraded';
  services: Array<{
    name: string;
    status: 'running' | 'stopped' | 'degraded';
    uptime?: number;
  }>;
}

export type UserListResponse = {
  users: User[];
  total: number;
};

export interface UserCreatePayload {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending';
  creditLimit: number;
  subscriptionPlan: string;
}

export interface UserUpdatePayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  status?: 'active' | 'suspended' | 'pending';
  creditLimit?: number;
  subscriptionPlan?: string;
}

export interface AgentListResponse {
  agents: Agent[];
}

export interface DashboardData {
  totalCalls: number;
  activeAgents: number;
  avgCallDuration: number;
  successRate: number;
  callChangePercentage: number;
  agentChangePercentage: number;
  durationChangePercentage: number;
  successRateChangePercentage: number;
  callActivity: Array<{
    date: string;
    count: number;
  }>;
  durationTrend: Array<{
    date: string;
    duration: number;
  }>;
}