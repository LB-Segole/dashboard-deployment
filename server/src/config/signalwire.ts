import { config } from './index';
import { RestClient } from '@signalwire/compatibility-api';
import type { Call, CallInstance, CallListInstanceCreateOptions } from '@signalwire/compatibility-api/lib/rest/api/v2010/account/call';
import { logger } from '@/utils/Logger';
import { retry } from '@/utils/retry';
import { RateLimiter } from '@/utils/rateLimiter';

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

interface CallOptions extends Partial<CallListInstanceCreateOptions> {
  url?: string;
  method?: 'GET' | 'POST';
  statusCallback?: string;
  statusCallbackEvent?: string[];
  statusCallbackMethod?: 'GET' | 'POST';
  timeout?: number;
  machineDetection?: 'Enable' | 'DetectMessageEnd' | 'DetectMessageEnd_AsyncDual';
  machineDetectionTimeout?: number;
  asyncAmd?: boolean;
  amdStatusCallback?: string;
  amdStatusCallbackMethod?: 'GET' | 'POST';
}

class SignalWireService {
  private client: RestClient;
  private rateLimiter: RateLimiter;
  private static instance: SignalWireService;
  private readonly defaultRetryAttempts = config.signalWire.retryAttempts;
  private readonly defaultRetryDelay = config.signalWire.retryDelay;
  private readonly maxRetryDelay = 8000;
  private readonly defaultTimeout = config.signalWire.timeout;
  private readonly maxConcurrentCalls = config.signalWire.maxCallsPerHour;
  private activeCalls: Set<string> = new Set();

  private constructor() {
    if (!config.signalWire.projectId || !config.signalWire.apiToken || !config.signalWire.spaceUrl) {
      throw new Error('SignalWire configuration is incomplete');
    }

    this.client = new RestClient(
      config.signalWire.projectId,
      config.signalWire.apiToken,
      { signalwireSpaceUrl: config.signalWire.spaceUrl }
    );

    this.rateLimiter = new RateLimiter({
      maxRequests: this.maxConcurrentCalls,
      interval: 3600 * 1000, // 1 hour
    });

    // Log configuration
    logger.info('SignalWire service initialized', {
      spaceUrl: config.signalWire.spaceUrl,
      maxCallsPerHour: this.maxConcurrentCalls,
      retryAttempts: this.defaultRetryAttempts,
      retryDelay: this.defaultRetryDelay,
    });
  }

  public static getInstance(): SignalWireService {
    if (!SignalWireService.instance) {
      SignalWireService.instance = new SignalWireService();
    }
    return SignalWireService.instance;
  }

  private shouldRetry(error: any): boolean {
    // Retry on rate limits and specific error codes
    if (error.status) {
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

  public async makeCall(
    from: string,
    to: string,
    callOptions: CallOptions = {}
  ): Promise<string> {
    const startTime = Date.now();

    try {
      // Validate phone numbers
      if (!this.isValidPhoneNumber(from) || !this.isValidPhoneNumber(to)) {
        throw new Error('Invalid phone number format');
      }

      // Check rate limit
      await this.rateLimiter.checkLimit();
      metrics.increment('signalwire.call.attempts');

      if (this.activeCalls.size >= this.maxConcurrentCalls) {
        throw new Error('Maximum concurrent calls limit reached');
      }

      const retryConfig = {
        attempts: this.defaultRetryAttempts,
        delay: this.defaultRetryDelay,
        maxDelay: this.maxRetryDelay,
        shouldRetry: this.shouldRetry,
        onRetry: (error: Error, attempt: number) => {
          logger.warn('Retrying makeCall', {
            error: error.message,
            attempt,
            from,
            to,
          });
          metrics.increment('signalwire.call.retries');
        },
      };

      const call = await retry(() =>
        this.client.calls.create({
          from,
          to,
          timeout: callOptions.timeout || this.defaultTimeout / 1000, // Convert to seconds
          ...callOptions,
        }),
        retryConfig
      ) as Call;

      this.activeCalls.add(call.sid);
      const duration = Date.now() - startTime;

      logger.info('Call initiated successfully', {
        callSid: call.sid,
        from,
        to,
        status: call.status,
        duration,
      });

      metrics.timing('signalwire.call.initiation.duration', duration);
      metrics.gauge('signalwire.calls.active', this.activeCalls.size);
      metrics.increment('signalwire.call.success');

      return call.sid;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      metrics.timing('signalwire.call.initiation.duration', duration);
      metrics.increment('signalwire.call.errors');

      if (error.status) {
        metrics.increment(`signalwire.call.errors.${error.status}`);
      }

      logger.error('Failed to initiate call', {
        error: error.message,
        code: error.code,
        status: error.status,
        from,
        to,
        options: callOptions,
        duration,
      });

      throw new Error(`Failed to initiate call: ${error.message}`);
    }
  }

  public async endCall(callSid: string): Promise<boolean> {
    const startTime = Date.now();

    try {
      const retryConfig = {
        attempts: this.defaultRetryAttempts,
        delay: this.defaultRetryDelay,
        maxDelay: this.maxRetryDelay,
        shouldRetry: this.shouldRetry,
        onRetry: (error: Error, attempt: number) => {
          logger.warn('Retrying endCall', {
            error: error.message,
            attempt,
            callSid,
          });
          metrics.increment('signalwire.call.end.retries');
        },
      };

      await retry(async () => {
        const call = this.client.calls(callSid) as CallInstance;
        await call.update({ status: 'completed' });
      }, retryConfig);

      this.activeCalls.delete(callSid);
      const duration = Date.now() - startTime;

      logger.info('Call ended successfully', {
        callSid,
        duration,
        activeCallsCount: this.activeCalls.size,
      });

      metrics.timing('signalwire.call.end.duration', duration);
      metrics.gauge('signalwire.calls.active', this.activeCalls.size);
      metrics.increment('signalwire.call.end.success');

      return true;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      metrics.timing('signalwire.call.end.duration', duration);
      metrics.increment('signalwire.call.end.errors');

      if (error.status) {
        metrics.increment(`signalwire.call.end.errors.${error.status}`);
      }

      logger.error('Failed to end call', {
        error: error.message,
        code: error.code,
        status: error.status,
        callSid,
        duration,
      });

      throw new Error(`Failed to end call: ${error.message}`);
    }
  }

  public async getCall(callSid: string): Promise<Call> {
    const startTime = Date.now();

    try {
      const retryConfig = {
        attempts: this.defaultRetryAttempts,
        delay: this.defaultRetryDelay,
        maxDelay: this.maxRetryDelay,
        shouldRetry: this.shouldRetry,
        onRetry: (error: Error, attempt: number) => {
          logger.warn('Retrying getCall', {
            error: error.message,
            attempt,
            callSid,
          });
          metrics.increment('signalwire.call.get.retries');
        },
      };

      const call = await retry(async () => {
        const callInstance = this.client.calls(callSid) as CallInstance;
        return await callInstance.fetch();
      }, retryConfig) as Call;

      const duration = Date.now() - startTime;

      logger.debug('Retrieved call details', {
        callSid,
        status: call.status,
        duration: call.duration,
        requestDuration: duration,
      });

      metrics.timing('signalwire.call.get.duration', duration);
      metrics.increment('signalwire.call.get.success');

      // Update active calls based on status
      if (call.status === 'completed' || call.status === 'failed' || call.status === 'busy' || call.status === 'no-answer') {
        this.activeCalls.delete(callSid);
        metrics.gauge('signalwire.calls.active', this.activeCalls.size);
      }

      return call;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      metrics.timing('signalwire.call.get.duration', duration);
      metrics.increment('signalwire.call.get.errors');

      if (error.status) {
        metrics.increment(`signalwire.call.get.errors.${error.status}`);
      }

      logger.error('Failed to get call details', {
        error: error.message,
        code: error.code,
        status: error.status,
        callSid,
        duration,
      });

      throw new Error(`Failed to get call details: ${error.message}`);
    }
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic E.164 format validation
    return /^\+[1-9]\d{10,14}$/.test(phoneNumber);
  }

  public getClient(): RestClient {
    return this.client;
  }

  public getStats() {
    return {
      activeCallsCount: this.activeCalls.size,
      rateLimiterStats: this.rateLimiter.getStats(),
    };
  }
}

// Export singleton instance
export const signalwire = SignalWireService.getInstance();
export default signalwire;