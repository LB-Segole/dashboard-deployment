// services/analyticsService.ts
import axios from 'axios';
import { AnalyticsData, CallAnalytics, AgentPerformance } from '@/types/dashboard';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '/api/v1';

// Add types for API metrics
export type TimeRange = '24h' | '7d' | '30d';

export interface APIMetrics {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  averageLatency: number;
  requestsOverTime: Array<{ timestamp: string; count: number }>;
}

export async function fetchAPIMetrics(range: TimeRange): Promise<APIMetrics> {
  const response = await axios.get(`${API_BASE_URL}/analytics/api-metrics`, {
    params: { range },
  });
  return response.data;
}

export const AnalyticsService = {
  async getDashboardAnalytics(): Promise<AnalyticsData> {
    const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`);
    return response.data;
  },

  async getCallAnalytics(timeRange: '24h' | '7d' | '30d'): Promise<CallAnalytics> {
    const response = await axios.get(`${API_BASE_URL}/analytics/calls`, {
      params: { range: timeRange },
    });
    return response.data;
  },

  async getAgentPerformance(agentId?: string): Promise<AgentPerformance[]> {
    const url = agentId 
      ? `${API_BASE_URL}/analytics/agents/${agentId}/performance`
      : `${API_BASE_URL}/analytics/agents/performance`;
    
    const response = await axios.get(url);
    return response.data;
  },

  async exportAnalytics(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await axios.get(`${API_BASE_URL}/analytics/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};