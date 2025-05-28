import { useState, useEffect } from 'react';

interface UserMetrics {
  activeUsers: {
    date: string;
    count: number;
  }[];
  userSignups: {
    date: string;
    count: number;
  }[];
  featureUsage: {
    feature: string;
    usageCount: number;
  }[];
}

type TimeRange = '7d' | '30d' | '90d' | '1y';

export const useUserMetrics = (initialRange: TimeRange = '7d') => {
  const [data, setData] = useState<UserMetrics>({
    activeUsers: [],
    userSignups: [],
    featureUsage: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialRange);

  const fetchMetrics = async (range: TimeRange = timeRange) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      const mockData: UserMetrics = {
        activeUsers: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 1000) + 500,
        })).reverse(),
        userSignups: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 100) + 20,
        })).reverse(),
        featureUsage: [
          { feature: 'Voice Calls', usageCount: Math.floor(Math.random() * 5000) + 1000 },
          { feature: 'Sentiment Analysis', usageCount: Math.floor(Math.random() * 3000) + 500 },
          { feature: 'Call Recording', usageCount: Math.floor(Math.random() * 2000) + 300 },
          { feature: 'Transcription', usageCount: Math.floor(Math.random() * 4000) + 800 },
        ],
      };
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  return {
    data,
    loading,
    error,
    timeRange,
    setTimeRange,
    refresh: () => fetchMetrics(),
  };
};

export default useUserMetrics; 