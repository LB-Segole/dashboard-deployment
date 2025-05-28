import { useState } from 'react';
import {
  createAgent,
  updateAgent,
  deleteAgent,
  listAgents,
  getAgentDetails,
  Agent,
  AgentConfig,
  AgentListResponse
} from '@/services/agentService';

export const useAgentManagement = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response: AgentListResponse = await listAgents(page, limit);
      setAgents(response.agents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async (config: AgentConfig) => {
    setLoading(true);
    setError(null);
    try {
      const newAgent = await createAgent(config);
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAgentConfig = async (id: string, config: Partial<AgentConfig>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAgent = await updateAgent(id, config);
      setAgents(prev => prev.map(a => a.id === id ? updatedAgent : a));
      if (selectedAgent?.id === id) {
        setSelectedAgent(updatedAgent);
      }
      return updatedAgent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update agent');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAgent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAgent(id);
      setAgents(prev => prev.filter(a => a.id !== id));
      if (selectedAgent?.id === id) {
        setSelectedAgent(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete agent');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAgent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const agent = await getAgentDetails(id);
      setSelectedAgent(agent);
      return agent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get agent details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    agents,
    selectedAgent,
    loading,
    error,
    fetchAgents,
    addAgent,
    updateAgentConfig,
    removeAgent,
    getAgent,
    setSelectedAgent
  };
};