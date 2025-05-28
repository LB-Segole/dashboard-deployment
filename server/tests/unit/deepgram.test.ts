import { DeepgramService } from '../../src/services/deepgram-service';
import { AppError } from '../../src/errors/AppError';

jest.mock('@deepgram/sdk');

describe('Deepgram Service Unit Tests', () => {
  const testAudioUrl = 'https://example.com/audio.wav';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('transcribeAudio', () => {
    it('should return transcription', async () => {
      const mockResponse = {
        results: {
          channels: [{
            alternatives: [{
              transcript: 'Test transcription',
              confidence: 0.9
            }]
          }]
        }
      };

      require('@deepgram/sdk').Deepgram.prototype.transcription.preRecorded.mockResolvedValue(mockResponse);

      const result = await DeepgramService.transcribeAudio(testAudioUrl);
      expect(result).toEqual(mockResponse.results);
    });

    it('should throw error on failure', async () => {
      require('@deepgram/sdk').Deepgram.prototype.transcription.preRecorded.mockRejectedValue(new Error('API error'));

      await expect(DeepgramService.transcribeAudio(testAudioUrl))
        .rejects
        .toThrow(AppError);
    });
  });
});