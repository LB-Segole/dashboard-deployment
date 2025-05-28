import { useState, useEffect } from 'react';
import { CallAnalyticsData } from '@/types/callTypes';

interface CallAnalyticsParams {
  startDate?: string;
  endDate?: string;
  agentId?: string;
}

export const useCallAnalytics = () => {
  const [data, setData] = useState<CallAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<CallAnalyticsParams>({});

  const fetchAnalytics = async (newParams?: CallAnalyticsParams) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update params if new ones are provided
      if (newParams) {
        setParams(newParams);
      }

      // TODO: Replace with actual API call
      const mockData: CallAnalyticsData = {
        sentimentScore: 0.75,
        customerSatisfaction: 0.85,
        resolutionTime: 180,
        conversationFlow: [
          { name: 'Greeting', duration: 15 },
          { name: 'Problem Identification', duration: 45 },
          { name: 'Resolution', duration: 90 },
          { name: 'Closing', duration: 30 },
        ],
        insights: [
          'Customer showed positive sentiment throughout the call',
          'Agent provided clear explanations',
          'Resolution was achieved efficiently',
        ],
        overallSentiment: {
          score: 0.75,
          label: 'positive',
        },
        customerSentiment: {
          score: 0.8,
          label: 'positive',
        },
        agentSentiment: {
          score: 0.7,
          label: 'positive',
        },
        topics: [
          { name: 'Technical Issue', count: 5, sentiment: 0.6 },
          { name: 'Billing', count: 3, sentiment: 0.4 },
          { name: 'Product Features', count: 4, sentiment: 0.8 },
        ],
        metrics: {
          talkListenRatio: 1.2,
          interruptions: 3,
          interruptionsPerMinute: 0.5,
          silencePercentage: 12,
        },
      };

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const updateParams = (newParams: CallAnalyticsParams) => {
    fetchAnalytics(newParams);
  };

  const refresh = () => {
    fetchAnalytics(params);
  };

  return {
    data,
    loading,
    error,
    params,
    updateParams,
    refresh,
  };
};