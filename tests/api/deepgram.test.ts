import { describe, expect, it, vi } from 'vitest';
import { httpClient } from '../../services/apiclient';
import { DeepgramTranscriptionResponse } from '../../types/deepgram';

describe('Deepgram API Integration', () => {
  const mockTranscription: DeepgramTranscriptionResponse = {
    metadata: {
      request_id: 'test123',
      created: '2023-01-01T00:00:00Z',
      duration: 10.5,
      channels: 1,
    },
    results: {
      channels: [{
        alternatives: [{
          transcript: 'Hello world',
          confidence: 0.95,
          words: [{
            word: 'Hello',
            start: 0.1,
            end: 0.5,
            confidence: 0.98,
          }],
        }],
      }],
    },
  };

  it('should successfully transcribe audio', async () => {
    vi.spyOn(httpClient, 'post').mockResolvedValue(mockTranscription);
    
    const response = await httpClient.post<DeepgramTranscriptionResponse>(
      '/voice/transcribe',
      { audio_url: 'test.mp3' }
    );

    expect(response).toEqual(mockTranscription);
    expect(response.results.channels[0].alternatives[0].transcript).toContain('Hello');
  });

  it('should handle transcription errors', async () => {
    vi.spyOn(httpClient, 'post').mockRejectedValue(new Error('Transcription failed'));
    
    await expect(
      httpClient.post('/voice/transcribe', { audio_url: 'invalid.mp3' })
    ).rejects.toThrow('Transcription failed');
  });
});