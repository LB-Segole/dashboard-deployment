import { useState, useEffect, useCallback } from 'react';
import { Call } from '@/types/callTypes';

interface CallsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  agentId?: string;
  status?: string;
}

interface CallsResponse {
  calls: Call[];
  total: number;
}

const fetchCallsFromAPI = async (params: CallsParams): Promise<CallsResponse> => {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

  // Mock data
  const mockCalls: Call[] = Array.from({ length: params.limit || 10 }, (_, i) => ({
    id: `call-${i + 1}`,
    agentId: `agent-${(i % 3) + 1}`,
    from: { number: `+1234567${(890 + i).toString().padStart(3, '0')}` },
    to: { number: `+9876543${(210 + i).toString().padStart(3, '0')}` },
    startTime: new Date(Date.now() - i * 3600000).toISOString(),
    duration: Math.floor(Math.random() * 600) + 60,
    status: Math.random() > 0.2 ? 'completed' : Math.random() > 0.5 ? 'failed' : 'in-progress',
  }));

  return {
    calls: mockCalls,
    total: 100,
  };
};

export const useCalls = (initialParams?: CallsParams) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [params, setParams] = useState<CallsParams>(initialParams || {
    page: 1,
    limit: 10,
  });

  const fetchCalls = useCallback(async (newParams?: CallsParams) => {
    try {
      setLoading(true);
      setError(null);

      // Update params if new ones are provided
      const currentParams = newParams ? { ...params, ...newParams } : params;
      setParams(currentParams);

      const response = await fetchCallsFromAPI(currentParams);
      setCalls(response.calls);
      setTotalCount(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calls');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const refresh = () => {
    fetchCalls();
  };

  return {
    calls,
    loading,
    error,
    totalCount,
    params,
    setParams,
    refresh,
  };
}; 