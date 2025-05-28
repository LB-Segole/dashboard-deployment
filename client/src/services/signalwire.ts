import { api } from './api';

export const signalwireService = {
  createCall: async (to: string, from: string, context: string, token: string) => {
    return api.post('/signalwire/calls', { to, from, context }, token);
  },

  listCalls: async (page = 1, limit = 20, token: string) => {
    return api.get(`/signalwire/calls?page=${page}&limit=${limit}`, token);
  },

  getCall: async (callId: string, token: string) => {
    return api.get(`/signalwire/calls/${callId}`, token);
  },

  updateCall: async (callId: string, updates: any, token: string) => {
    return api.put(`/signalwire/calls/${callId}`, updates, token);
  },

  endCall: async (callId: string, token: string) => {
    return api.post(`/signalwire/calls/${callId}/end`, {}, token);
  },

  playAudio: async (callId: string, audioUrl: string, token: string) => {
    return api.post(`/signalwire/calls/${callId}/play`, { audioUrl }, token);
  },

  sendDigits: async (callId: string, digits: string, token: string) => {
    return api.post(`/signalwire/calls/${callId}/digits`, { digits }, token);
  },

  recordCall: async (callId: string, options: any, token: string) => {
    return api.post(`/signalwire/calls/${callId}/record`, options, token);
  },

  getRecording: async (recordingId: string, token: string) => {
    return api.get(`/signalwire/recordings/${recordingId}`, token);
  },
};