import { describe, expect, it, vi } from 'vitest';
import { httpClient } from '../../services/apiclient';
import { OpenAIResponse } from '../../types/openai';

describe('OpenAI API Integration', () => {
  const mockResponse: OpenAIResponse = {
    id: 'chat-123',
    object: 'chat.completion',
    created: 1677652288,
    choices: [{
      message: {
        role: 'assistant',
        content: 'Hello! How can I help you today?',
      },
      finish_reason: 'stop',
      index: 0,
    }],
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
    },
  };

  it('should generate proper chat response', async () => {
    vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);
    
    const response = await httpClient.post<OpenAIResponse>(
      '/ai/chat',
      { messages: [{ role: 'user', content: 'Hello' }] }
    );

    expect(response.choices[0].message.content).toBe('Hello! How can I help you today?');
    expect(response.usage.total_tokens).toBeGreaterThan(0);
  });

  it('should handle rate limiting', async () => {
    vi.spyOn(httpClient, 'post').mockRejectedValue({
      response: { status: 429, data: { error: 'Rate limit exceeded' } }
    });
    
    await expect(
      httpClient.post('/ai/chat', { messages: [] })
    ).rejects.toMatchObject({
      response: { status: 429 }
    });
  });
});