// services/callService.ts
import { apiService } from './apiService';
import { Call, CallRecording, CallTranscript } from '@/types/dashboard';

export const CallService = {
  async getCalls(
    page: number = 1,
    limit: number = 20,
    filters?: Record<string, any>
  ): Promise<{ calls: Call[]; total: number }> {
    const response = await apiService.get<{ data: Call[]; total: number }>('/calls', {
      params: { page, limit, ...filters },
    });
    return { calls: response.data, total: response.total };
  },

  async getCallDetails(callId: string): Promise<Call> {
    return await apiService.get<Call>(`/calls/${callId}`);
  },

  async getCallRecordings(callId: string): Promise<CallRecording[]> {
    return await apiService.get<CallRecording[]>(`/calls/${callId}/recordings`);
  },

  async getCallTranscript(callId: string): Promise<CallTranscript> {
    return await apiService.get<CallTranscript>(`/calls/${callId}/transcript`);
  },

  async initiateCall(params: {
    agentId: string;
    destination: string;
    callerId?: string;
    metadata?: Record<string, any>;
  }): Promise<{ callId: string }> {
    return await apiService.post<{ callId: string }>('/calls/initiate', params);
  },

  async endCall(callId: string): Promise<void> {
    await apiService.post(`/calls/${callId}/end`);
  },

  async transferCall(callId: string, target: string): Promise<void> {
    await apiService.post(`/calls/${callId}/transfer`, { target });
  },

  async downloadRecording(recordingId: string): Promise<Blob> {
    return await apiService.get<Blob>(`/recordings/${recordingId}/download`, {
      responseType: 'blob',
    });
  },
};