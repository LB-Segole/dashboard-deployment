import { useState, useEffect } from 'react';

interface RevenueData {
  dailyRevenue: {
    date: string;
    amount: number;
  }[];
  revenueByPlan: {
    plan: string;
    revenue: number;
    percentage: number;
  }[];
  mrrGrowth: {
    date: string;
    mrr: number;
    growth: number;
  }[];
  totalRevenue: number;
  mrrCurrent: number;
  mrrGrowthRate: number;
}

type TimeRange = '7d' | '30d' | '90d' | '1y';

export const useRevenueAnalytics = (initialRange: TimeRange = '7d') => {
  const [data, setData] = useState<RevenueData>({
    dailyRevenue: [],
    revenueByPlan: [],
    mrrGrowth: [],
    totalRevenue: 0,
    mrrCurrent: 0,
    mrrGrowthRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialRange);

  const fetchRevenue = async (range: TimeRange = timeRange) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      const mockData: RevenueData = {
        dailyRevenue: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 5000) + 2000,
        })).reverse(),
        revenueByPlan: [
          { plan: 'Basic', revenue: 10000, percentage: 20 },
          { plan: 'Pro', revenue: 25000, percentage: 50 },
          { plan: 'Enterprise', revenue: 15000, percentage: 30 },
        ],
        mrrGrowth: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          mrr: Math.floor(Math.random() * 50000) + 30000,
          growth: (Math.random() * 5) + 1,
        })).reverse(),
        totalRevenue: 50000,
        mrrCurrent: 35000,
        mrrGrowthRate: 15.5,
      };
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [timeRange]);

  return {
    data,
    loading,
    error,
    timeRange,
    setTimeRange,
    refresh: () => fetchRevenue(),
  };
}; 