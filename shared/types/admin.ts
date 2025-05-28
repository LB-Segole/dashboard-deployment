/**
 * Admin-related Type Definitions
 */

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface SystemMetrics {
  activeUsers: number;
  callVolume: number;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export type AdminDashboardData = {
  metrics: SystemMetrics;
  recentUsers: AdminUser[];
  auditLogs: AuditLog[];
};