import { api } from './api';

const DEEPGRAM_BASE_URL = 'https://api.deepgram.com/v1';

export const deepgramService = {
  transcribe: async (audio: Blob, options: any = {}, token: string) => {
    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('options', JSON.stringify(options));

    const response = await fetch(`${DEEPGRAM_BASE_URL}/listen`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Deepgram transcription failed');
    }

    return response.json();
  },

  getUsage: async (token: string) => {
    return api.get('/integrations/deepgram/usage', token);
  },

  updateCredentials: async (apiKey: string, token: string) => {
    return api.put('/integrations/deepgram/credentials', { apiKey }, token);
  },
};