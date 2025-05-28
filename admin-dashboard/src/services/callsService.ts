import { CallDetails, CallSummary, CallFilters, CallStats } from '@/types/calls';
import { api } from '@/lib/api';

export const fetchCallDetails = async (callId: string): Promise<CallDetails> => {
  try {
    const response = await api.get(`/api/calls/${callId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch call details');
  }
};

export const fetchCalls = async (filters?: CallFilters): Promise<CallSummary[]> => {
  try {
    const response = await api.get('/api/calls', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch calls');
  }
};

export const fetchCallStats = async (startDate?: string, endDate?: string): Promise<CallStats> => {
  try {
    const response = await api.get('/api/calls/stats', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch call statistics');
  }
};

export const updateCallStatus = async (callId: string, status: CallDetails['status']): Promise<void> => {
  try {
    await api.patch(`/api/calls/${callId}/status`, { status });
  } catch (error) {
    throw new Error('Failed to update call status');
  }
};

export const deleteCall = async (callId: string): Promise<void> => {
  try {
    await api.delete(`/api/calls/${callId}`);
  } catch (error) {
    throw new Error('Failed to delete call');
  }
}; 