import { Deepgram } from '@deepgram/sdk';
import { config } from '../config';
import { AppError } from '../errors/AppError';

const deepgram = new Deepgram(config.deepgram.apiKey);

export const DeepgramService = {
  async transcribeAudio(audioUrl: string) {
    try {
      const response = await deepgram.transcription.preRecorded(
        { url: audioUrl },
        { punctuate: true, diarize: true, utterances: true }
      );

      return response.results;
    } catch (error) {
      throw new AppError('Transcription failed', 500);
    }
  },

  async getLiveTranscription(stream: any) {
    // Implementation for real-time transcription
  }
};