import { useState, useEffect } from 'react';

export interface APIMetrics {
  requestCount: {
    date: string;
    count: number;
  }[];
  responseTime: {
    date: string;
    averageMs: number;
  }[];
  errorRate: {
    date: string;
    rate: number;
  }[];
  topEndpoints: {
    endpoint: string;
    count: number;
    averageResponseTime: number;
  }[];
  statusCodes: {
    code: number;
    count: number;
    percentage: number;
  }[];
  totalRequests: number;
  averageResponseTime: number;
  errorRateAverage: number;
}

export type TimeRange = '7d' | '30d' | '90d' | '1y';

export const fetchAPIMetrics = async (range: TimeRange): Promise<APIMetrics> => {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

  const mockData: APIMetrics = {
    requestCount: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10000) + 5000,
    })).reverse(),
    responseTime: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      averageMs: Math.floor(Math.random() * 200) + 100,
    })).reverse(),
    errorRate: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rate: Math.random() * 2,
    })).reverse(),
    topEndpoints: [
      {
        endpoint: '/api/calls',
        count: 15000,
        averageResponseTime: 150,
      },
      {
        endpoint: '/api/agents',
        count: 12000,
        averageResponseTime: 120,
      },
      {
        endpoint: '/api/analytics',
        count: 8000,
        averageResponseTime: 200,
      },
      {
        endpoint: '/api/users',
        count: 5000,
        averageResponseTime: 100,
      },
    ],
    statusCodes: [
      { code: 200, count: 45000, percentage: 90 },
      { code: 400, count: 2500, percentage: 5 },
      { code: 401, count: 1000, percentage: 2 },
      { code: 500, count: 1500, percentage: 3 },
    ],
    totalRequests: 50000,
    averageResponseTime: 150,
    errorRateAverage: 1.5,
  };

  return mockData;
};

export const useAPIMetrics = (initialRange: TimeRange = '7d') => {
  const [metrics, setMetrics] = useState<APIMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialRange);

  const loadMetrics = async (range: TimeRange = timeRange) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAPIMetrics(range);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  return {
    metrics,
    loading,
    error,
    timeRange,
    setTimeRange,
    refresh: loadMetrics,
  };
};