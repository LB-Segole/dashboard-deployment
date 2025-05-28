// services/systemService.ts
import { apiService } from './apiService';
import { SystemStatus, SystemLog, SystemSettings as SystemConfig } from '@/types/admin';

type SystemConfigUpdate = Partial<SystemConfig>;

export type { SystemConfig, SystemConfigUpdate };

export async function getSystemConfig(): Promise<SystemConfig> {
  return await apiService.get<SystemConfig>('/system/config');
}

export async function updateSystemConfig(updates: SystemConfigUpdate): Promise<SystemConfig> {
  return await apiService.put<SystemConfig>('/system/config', updates);
}

export const SystemService = {
  async getSystemStatus(): Promise<SystemStatus> {
    return await apiService.get<SystemStatus>('/system/status');
  },

  async getSystemLogs(
    page: number = 1,
    limit: number = 50,
    level?: string
  ): Promise<{ logs: SystemLog[]; total: number }> {
    const response = await apiService.get<{ data: SystemLog[]; total: number }>('/system/logs', {
      params: { page, limit, level },
    });
    return { logs: response.data, total: response.total };
  },

  async restartService(service: string): Promise<void> {
    await apiService.post(`/system/services/${service}/restart`);
  },

  async clearCache(): Promise<void> {
    await apiService.post('/system/cache/clear');
  },

  async runDiagnostics(): Promise<{ [key: string]: any }> {
    return await apiService.get<{ [key: string]: any }>('/system/diagnostics');
  },

  async backupDatabase(): Promise<Blob> {
    return await apiService.get<Blob>('/system/backup', {
      responseType: 'blob',
    });
  },

  async restoreDatabase(file: File): Promise<void> {
    await apiService.upload('/system/restore', file);
  },
};