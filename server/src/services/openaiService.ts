import OpenAI from 'openai';
import { config } from '../config';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/Logger';
import { redis } from '../lib/redis';
import { retry } from '../utils/retry';
import { createHash } from 'crypto';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// Cache key prefixes
const RESPONSE_CACHE_PREFIX = 'openai:response:';
const RATE_LIMIT_PREFIX = 'ratelimit:openai:';

// Token tracking
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export const OpenAIService = {
  async generateAgentResponse(
    prompt: string,
    context: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      cacheResponse?: boolean;
      userId?: string;
    } = {}
  ) {
    try {
      // Check rate limits
      if (options.userId) {
        await this.checkRateLimit(options.userId);
      }

      // Try to get from cache if enabled
      if (options.cacheResponse) {
        const cacheKey = this.generateCacheKey(prompt, context);
        const cachedResponse = await redis.get(cacheKey);
        if (cachedResponse) {
          logger.info('Using cached OpenAI response');
          return JSON.parse(cachedResponse);
        }
      }

      // Generate response with retries
      const response = await retry(
        async () => {
          return await openai.chat.completions.create({
            model: config.openai.model || 'gpt-4',
            messages: [
              { role: 'system', content: context },
              { role: 'user', content: prompt },
            ],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 150,
            presence_penalty: 0.6,
            frequency_penalty: 0.6,
          });
        },
        {
          retries: 3,
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 5000,
          onRetry: (error) => {
            logger.warn('Retrying OpenAI request:', error);
          },
        }
      );

      const generatedText = response.choices[0]?.message?.content || '';

      // Track token usage
      if (options.userId) {
        await this.trackTokenUsage(options.userId, {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        });
      }

      // Cache response if enabled
      if (options.cacheResponse && generatedText) {
        const cacheKey = this.generateCacheKey(prompt, context);
        await redis.setex(
          cacheKey,
          config.openai.cacheTTL || 3600,
          JSON.stringify(generatedText)
        );
      }

      return generatedText;
    } catch (error) {
      logger.error('OpenAI API Error:', error);
      
      if (error instanceof OpenAI.APIError) {
        switch (error.status) {
          case 429:
            throw new AppError('Rate limit exceeded', 429);
          case 401:
            throw new AppError('Invalid API key', 401);
          case 500:
            throw new AppError('OpenAI service error', 503);
          default:
            throw new AppError(
              `OpenAI API error: ${error.message}`,
              error.status
            );
        }
      }

      throw new AppError(
        'Failed to generate AI response: ' + (error as Error).message,
        500
      );
    }
  },

  async analyzeConversation(
    transcript: string,
    options: {
      maxTokens?: number;
      userId?: string;
    } = {}
  ) {
    try {
      // Check rate limits
      if (options.userId) {
        await this.checkRateLimit(options.userId);
      }

      const response = await retry(
        async () => {
          return await openai.chat.completions.create({
            model: config.openai.model || 'gpt-4',
            messages: [
              {
                role: 'system',
                content:
                  'Analyze this conversation transcript and provide insights about: ' +
                  '1. Key topics discussed ' +
                  '2. Customer sentiment ' +
                  '3. Action items or follow-ups needed ' +
                  '4. Areas for improvement',
              },
              { role: 'user', content: transcript },
            ],
            temperature: 0.5,
            max_tokens: options.maxTokens || 300,
          });
        },
        {
          retries: 2,
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 5000,
        }
      );

      const analysis = response.choices[0]?.message?.content || '';

      // Track token usage
      if (options.userId) {
        await this.trackTokenUsage(options.userId, {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        });
      }

      return analysis;
    } catch (error) {
      logger.error('Failed to analyze conversation:', error);
      throw new AppError(
        'Failed to analyze conversation: ' + (error as Error).message,
        500
      );
    }
  },

  private async checkRateLimit(userId: string): Promise<void> {
    const key = `${RATE_LIMIT_PREFIX}${userId}`;
    const limit = config.openai.rateLimit || 100; // requests per hour
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, 3600); // 1 hour window
    }
    
    if (current > limit) {
      throw new AppError('Rate limit exceeded', 429);
    }
  },

  private async trackTokenUsage(
    userId: string,
    usage: TokenUsage
  ): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const key = `openai:usage:${userId}:${date}`;
    
    const current = await redis.hgetall(key);
    
    await redis.hmset(key, {
      promptTokens: (parseInt(current.promptTokens) || 0) + usage.promptTokens,
      completionTokens:
        (parseInt(current.completionTokens) || 0) + usage.completionTokens,
      totalTokens: (parseInt(current.totalTokens) || 0) + usage.totalTokens,
    });
    
    // Expire after 90 days
    await redis.expire(key, 7776000);
  },

  private generateCacheKey(prompt: string, context: string): string {
    const hash = createHash('sha256')
      .update(`${prompt}:${context}`)
      .digest('hex');
    return `${RESPONSE_CACHE_PREFIX}${hash}`;
  },
};