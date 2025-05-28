import { api } from './api';

export const callsService = {
  startCall: async (to: string, from: string, agentId?: string, token: string) => {
    return api.post('/calls/start', { to, from, agentId }, token);
  },

  endCall: async (callId: string, token: string) => {
    return api.post(`/calls/${callId}/end`, {}, token);
  },

  getCallHistory: async (page = 1, limit = 20, token: string) => {
    return api.get(`/calls/history?page=${page}&limit=${limit}`, token);
  },

  getCallDetails: async (callId: string, token: string) => {
    return api.get(`/calls/${callId}`, token);
  },

  getCallRecording: async (callId: string, token: string) => {
    return api.get(`/calls/${callId}/recording`, token);
  },

  getCallTranscript: async (callId: string, token: string) => {
    return api.get(`/calls/${callId}/transcript`, token);
  },

  sendDTMF: async (callId: string, digits: string, token: string) => {
    return api.post(`/calls/${callId}/dtmf`, { digits }, token);
  },

  transferCall: async (callId: string, to: string, token: string) => {
    return api.post(`/calls/${callId}/transfer`, { to }, token);
  },
};