import { useState, useEffect, useCallback } from 'react';
import { Agent } from '@/types/admin';
import { API_BASE_URL } from '@/config/constants';

interface AgentParams {
  page?: number;
  limit?: number;
  status?: 'online' | 'offline' | 'maintenance';
}

interface AgentResponse {
  agents: Agent[];
  total: number;
}

const fetchAgentsFromAPI = async (params: AgentParams): Promise<AgentResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 10).toString(),
      ...(params.status && { status: params.status }),
    });

    const response = await fetch(`${API_BASE_URL}/agents?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch agents');
    return await response.json();
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

export const useAgents = (initialParams?: AgentParams) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [params, setParams] = useState<AgentParams>(initialParams || {
    page: 1,
    limit: 10,
  });

  const fetchAgents = useCallback(async (newParams?: AgentParams) => {
    try {
      setLoading(true);
      setError(null);

      // Update params if new ones are provided
      const currentParams = newParams ? { ...params, ...newParams } : params;
      setParams(currentParams);

      const response = await fetchAgentsFromAPI(currentParams);
      setAgents(response.agents);
      setTotalCount(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
      // Mock data if API fails
      const mockAgents: Agent[] = Array.from({ length: params.limit || 10 }, (_, i) => ({
        id: `agent-${i + 1}`,
        name: `Agent ${i + 1}`,
        description: `AI Agent for various customer service tasks`,
        status: i % 3 === 0 ? 'online' : i % 3 === 1 ? 'offline' : 'maintenance',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        config: {
          agentId: `agent-${i + 1}`,
          name: `Agent ${i + 1}`,
          voiceModel: 'neural-v1',
          speechRate: 1.0,
          pitch: 1.0,
          language: 'en-US',
          voice: 'neutral',
          initialMessage: 'Hello, how can I help you today?',
          interruptionThreshold: 1000,
          sentimentAnalysis: true,
          enableInterruptions: true,
          enableSentimentAnalysis: true,
          enableCallRecording: true,
        },
      }));
      setAgents(mockAgents);
      setTotalCount(100);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const refresh = () => {
    fetchAgents();
  };

  return {
    agents,
    loading,
    error,
    totalCount,
    params,
    setParams,
    refresh,
  };
}; 