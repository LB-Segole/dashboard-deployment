import { OpenAIService } from '../../src/services/openai-service';
import { AppError } from '../../src/errors/AppError';

jest.mock('openai');

describe('OpenAI Service Unit Tests', () => {
  const testPrompt = 'Hello';
  const testContext = 'You are a helpful assistant';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAgentResponse', () => {
    it('should generate AI response', async () => {
      const mockResponse = {
        choices: [{
          message: { content: 'Hello there!' }
        }]
      };

      require('openai').OpenAI.prototype.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await OpenAIService.generateAgentResponse(testPrompt, testContext);
      expect(result).toBe('Hello there!');
    });

    it('should throw error on API failure', async () => {
      require('openai').OpenAI.prototype.chat.completions.create.mockRejectedValue(new Error('API error'));

      await expect(OpenAIService.generateAgentResponse(testPrompt, testContext))
        .rejects
        .toThrow(AppError);
    });
  });
});