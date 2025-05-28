// services/agentService.ts
import axios from 'axios';
import { Agent, AgentConfig, AgentListResponse } from '@/types/admin';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '/api/v1';

export const AgentService = {
  async getAgents(): Promise<Agent[]> {
    const response = await axios.get(`${API_BASE_URL}/agents`);
    return response.data;
  },

  async getAgent(id: string): Promise<Agent> {
    const response = await axios.get(`${API_BASE_URL}/agents/${id}`);
    return response.data;
  },

  async createAgent(agent: Omit<Agent, 'id' | 'createdAt'>): Promise<Agent> {
    const response = await axios.post(`${API_BASE_URL}/agents`, agent);
    return response.data;
  },

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const response = await axios.put(`${API_BASE_URL}/agents/${id}`, updates);
    return response.data;
  },

  async deleteAgent(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/agents/${id}`);
  },

  async getAgentConfig(agentId: string): Promise<AgentConfig> {
    const response = await axios.get(`${API_BASE_URL}/agents/${agentId}/config`);
    return response.data;
  },

  async updateAgentConfig(agentId: string, config: Partial<AgentConfig>): Promise<AgentConfig> {
    const response = await axios.put(`${API_BASE_URL}/agents/${agentId}/config`, config);
    return response.data;
  },

  async testAgentConnection(agentId: string): Promise<{ success: boolean; latency?: number }> {
    const response = await axios.post(`${API_BASE_URL}/agents/${agentId}/test`);
    return response.data;
  },
};

// CRUD functions for useAgentManagement
export async function createAgent(config: AgentConfig) {
  const response = await axios.post(`${API_BASE_URL}/agents`, config);
  return response.data;
}

export async function updateAgent(id: string, config: Partial<AgentConfig>) {
  const response = await axios.put(`${API_BASE_URL}/agents/${id}/config`, config);
  return response.data;
}

export async function deleteAgent(id: string) {
  await axios.delete(`${API_BASE_URL}/agents/${id}`);
  return true;
}

export async function listAgents(page = 1, limit = 10) {
  const response = await axios.get(`${API_BASE_URL}/agents`, { params: { page, limit } });
  return { agents: response.data };
}

export async function getAgentDetails(id: string) {
  const response = await axios.get(`${API_BASE_URL}/agents/${id}`);
  return response.data;
}

export type { Agent, AgentConfig, AgentListResponse };