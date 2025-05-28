import { useState, useEffect } from 'react';
import { DashboardData } from '@/types/admin';

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      const mockData: DashboardData = {
        totalCalls: 1234,
        activeAgents: 45,
        avgCallDuration: 300,
        successRate: 85,
        callChangePercentage: 12.5,
        agentChangePercentage: 5.2,
        durationChangePercentage: -2.1,
        successRateChangePercentage: 3.4,
        callActivity: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 100) + 50,
        })),
        durationTrend: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          duration: Math.floor(Math.random() * 300) + 200,
        })),
      };

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refresh,
  };
}; 