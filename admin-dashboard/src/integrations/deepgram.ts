import axios from 'axios';
import { DeepgramTranscriptionConfig, DeepgramTranscriptionResponse } from '@/types/integrationTypes';

const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1/listen';

export const transcribeWithDeepgram = async (
  audioUrl: string,
  config: DeepgramTranscriptionConfig = {}
): Promise<DeepgramTranscriptionResponse> => {
  try {
    const response = await axios.post(
      DEEPGRAM_API_URL,
      { url: audioUrl },
      {
        params: {
          punctuate: config.punctuate ?? true,
          numerals: config.numerals ?? true,
          diarize: config.diarize ?? false,
          ...config
        },
        headers: {
          'Authorization': `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Deepgram transcription error:', error);
    throw new Error(
      axios.isAxiosError(error) 
        ? error.response?.data?.message ?? 'Deepgram transcription failed'
        : 'Failed to connect to Deepgram'
    );
  }
};