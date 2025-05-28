import { config } from './index';
import OpenAI from 'openai';
import { logger } from '@/utils/Logger';
import { RateLimiter } from '@/utils/rateLimiter';
import { Cache } from '@/utils/cache';
import { retry } from '@/utils/retry';

// Metrics interface (to be implemented)
interface Metrics {
  increment(key: string): void;
  gauge(key: string, value: number): void;
  timing(key: string, value: number): void;
  histogram(key: string, value: number): void;
}

// Temporary metrics implementation until proper metrics service is set up
const metrics: Metrics = {
  increment: (key: string) => logger.debug(`Metric increment: ${key}`),
  gauge: (key: string, value: number) => logger.debug(`Metric gauge: ${key} = ${value}`),
  timing: (key: string, value: number) => logger.debug(`Metric timing: ${key} = ${value}ms`),
  histogram: (key: string, value: number) => logger.debug(`Metric histogram: ${key} = ${value}`),
};

interface OpenAIOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string | string[];
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

class OpenAIService {
  private client: OpenAI;
  private rateLimiter: RateLimiter;
  private cache: Cache;
  private static instance: OpenAIService;
  private readonly defaultRetryAttempts = config.openai.retryAttempts;
  private readonly defaultRetryDelay = 1000;
  private readonly maxRetryDelay = 8000;
  private readonly defaultTimeout = config.openai.timeout;

  private constructor() {
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
      timeout: this.defaultTimeout,
      maxRetries: 0, // We handle retries ourselves
    });

    this.rateLimiter = new RateLimiter({
      maxRequests: config.openai.rateLimit,
      interval: 60 * 1000, // 1 minute
    });

    this.cache = new Cache({
      ttl: config.openai.cacheTTL,
      max: 1000,
    });

    // Log configuration
    logger.info('OpenAI service initialized', {
      model: config.openai.model,
      maxTokens: config.openai.maxTokens,
      temperature: config.openai.temperature,
      rateLimit: config.openai.rateLimit,
      cacheTTL: config.openai.cacheTTL,
    });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private generateCacheKey(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], model: string): string {
    const hash = require('crypto').createHash('sha256');
    return `${model}:${hash.update(JSON.stringify(messages)).digest('hex')}`;
  }

  private shouldRetry(error: any): boolean {
    if (error instanceof OpenAI.APIError) {
      // Retry on rate limits and specific error types
      return (
        error.status === 429 || // Rate limit
        error.status === 500 || // Internal server error
        error.status === 502 || // Bad gateway
        error.status === 503 || // Service unavailable
        error.status === 504    // Gateway timeout
      );
    }
    // Retry on network errors
    return error.code === 'ECONNRESET' || 
           error.code === 'ETIMEDOUT' ||
           error.code === 'ESOCKETTIMEDOUT';
  }

  public async generateResponse(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    model: string = config.openai.model,
    options: OpenAIOptions = {}
  ): Promise<string | null> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(messages, model);
    
    try {
      // Check cache first
      const cachedResponse = this.cache.get<string>(cacheKey);
      if (cachedResponse) {
        logger.debug('Using cached response', { model, cacheKey });
        metrics.increment('openai.response.cache.hit');
        return cachedResponse;
      }
      metrics.increment('openai.response.cache.miss');

      // Check rate limit
      await this.rateLimiter.checkLimit();
      metrics.increment('openai.response.attempts');

      const retryConfig = {
        attempts: options.retryAttempts ?? this.defaultRetryAttempts,
        delay: options.retryDelay ?? this.defaultRetryDelay,
        maxDelay: this.maxRetryDelay,
        shouldRetry: this.shouldRetry,
        onRetry: (error: Error, attempt: number) => {
          logger.warn('Retrying OpenAI request', { 
            error: error.message,
            attempt,
            model,
            messageCount: messages.length,
          });
          metrics.increment('openai.response.retries');
        },
      };

      const response = await retry(() =>
        this.client.chat.completions.create({
          model,
          messages,
          temperature: options.temperature ?? config.openai.temperature,
          max_tokens: options.maxTokens ?? config.openai.maxTokens,
          top_p: options.topP ?? 1,
          frequency_penalty: options.frequencyPenalty ?? 0,
          presence_penalty: options.presencePenalty ?? 0,
          stop: options.stop,
          timeout: options.timeout ?? this.defaultTimeout,
        }),
        retryConfig
      );

      const content = response.choices[0]?.message?.content ?? null;

      if (content) {
        this.cache.set(cacheKey, content);
        const duration = Date.now() - startTime;
        
        logger.debug('Generated new response', {
          model,
          tokens: response.usage?.total_tokens,
          duration,
        });

        metrics.timing('openai.response.duration', duration);
        metrics.histogram('openai.response.tokens', response.usage?.total_tokens ?? 0);
        metrics.increment('openai.response.success');
      }

      return content;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      metrics.timing('openai.response.duration', duration);
      metrics.increment('openai.response.errors');

      if (error instanceof OpenAI.APIError) {
        metrics.increment(`openai.response.errors.${error.status}`);
      }

      logger.error('Failed to generate AI response', {
        error: error.message,
        code: error.code,
        status: error instanceof OpenAI.APIError ? error.status : undefined,
        model,
        duration,
        messageCount: messages.length,
      });

      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }

  public async createEmbedding(
    text: string,
    model: string = 'text-embedding-ada-002'
  ): Promise<number[] | null> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey([{ role: 'system', content: text }], `embedding:${model}`);
    
    try {
      // Check cache first
      const cachedEmbedding = this.cache.get<number[]>(cacheKey);
      if (cachedEmbedding) {
        logger.debug('Using cached embedding', { model, cacheKey });
        metrics.increment('openai.embedding.cache.hit');
        return cachedEmbedding;
      }
      metrics.increment('openai.embedding.cache.miss');

      // Check rate limit
      await this.rateLimiter.checkLimit();
      metrics.increment('openai.embedding.attempts');

      const retryConfig = {
        attempts: this.defaultRetryAttempts,
        delay: this.defaultRetryDelay,
        maxDelay: this.maxRetryDelay,
        shouldRetry: this.shouldRetry,
        onRetry: (error: Error, attempt: number) => {
          logger.warn('Retrying embedding request', {
            error: error.message,
            attempt,
            model,
            textLength: text.length,
          });
          metrics.increment('openai.embedding.retries');
        },
      };

      const response = await retry(() =>
        this.client.embeddings.create({
          model,
          input: text,
        }),
        retryConfig
      );

      const embedding = response.data[0]?.embedding ?? null;

      if (embedding) {
        this.cache.set(cacheKey, embedding);
        const duration = Date.now() - startTime;
        
        logger.debug('Generated new embedding', {
          model,
          textLength: text.length,
          duration,
        });

        metrics.timing('openai.embedding.duration', duration);
        metrics.histogram('openai.embedding.dimensions', embedding.length);
        metrics.increment('openai.embedding.success');
      }

      return embedding;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      metrics.timing('openai.embedding.duration', duration);
      metrics.increment('openai.embedding.errors');

      if (error instanceof OpenAI.APIError) {
        metrics.increment(`openai.embedding.errors.${error.status}`);
      }

      logger.error('Failed to create embedding', {
        error: error.message,
        code: error.code,
        status: error instanceof OpenAI.APIError ? error.status : undefined,
        model,
        textLength: text.length,
        duration,
      });

      throw new Error(`Failed to create embedding: ${error.message}`);
    }
  }

  public getClient(): OpenAI {
    return this.client;
  }

  public getStats() {
    return {
      rateLimiterStats: this.rateLimiter.getStats(),
      cacheStats: this.cache.getStats(),
    };
  }
}

// Export singleton instance
export const openai = OpenAIService.getInstance();
export default openai;