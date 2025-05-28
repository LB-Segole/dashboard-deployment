import { Deepgram } from '@deepgram/sdk';
import { config } from '../config';

let deepgramClient: Deepgram | null = null;

export function useDeepgram() {
  const getClient = (): Deepgram => {
    if (!deepgramClient) {
      deepgramClient = new Deepgram(config.deepgram.apiKey);
    }
    return deepgramClient;
  };

  const transcribeAudio = async (params: {
    audioUrl: string;
    language?: string;
    model?: string;
    punctuate?: boolean;
    profanityFilter?: boolean;
    keywords?: string[];
  }) => {
    const client = getClient();
    try {
      const source = { url: params.audioUrl };
      const options = {
        punctuate: params.punctuate ?? true,
        model: params.model || 'general',
        language: params.language || 'en-US',
        profanityFilter: params.profanityFilter,
        keywords: params.keywords,
      };

      const response = await client.transcription.preRecorded(source, options);
      return response.results?.channels[0]?.alternatives[0] || null;
    } catch (error) {
      throw new Error(`Failed to transcribe audio: ${error}`);
    }
  };

  const createLiveTranscription = async (params: {
    encoding: string;
    sampleRate: number;
    channels: number;
    language?: string;
    model?: string;
    punctuate?: boolean;
    profanityFilter?: boolean;
    keywords?: string[];
  }) => {
    const client = getClient();
    try {
      const options = {
        punctuate: params.punctuate ?? true,
        model: params.model || 'general',
        language: params.language || 'en-US',
        profanityFilter: params.profanityFilter,
        keywords: params.keywords,
        encoding: params.encoding,
        sampleRate: params.sampleRate,
        channels: params.channels,
      };

      return await client.transcription.live(options);
    } catch (error) {
      throw new Error(`Failed to create live transcription: ${error}`);
    }
  };

  return {
    getClient,
    transcribeAudio,
    createLiveTranscription,
  };
} 