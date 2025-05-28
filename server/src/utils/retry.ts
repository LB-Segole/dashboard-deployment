import { logger } from './Logger';

interface RetryOptions {
  retries: number;
  factor: number;
  minTimeout: number;
  maxTimeout: number;
  onRetry?: (error: Error, attempt: number) => void;
}

const defaultOptions: RetryOptions = {
  retries: 3,
  factor: 2,
  minTimeout: 1000,
  maxTimeout: 5000,
};

/**
 * Utility function to retry an async operation with exponential backoff
 * @param operation The async operation to retry
 * @param options Retry configuration options
 * @returns The result of the operation
 * @throws The last error encountered if all retries fail
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: Error | null = null;
  let attempt = 0;

  while (attempt < opts.retries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      attempt++;

      if (attempt === opts.retries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.maxTimeout,
        opts.minTimeout * Math.pow(opts.factor, attempt)
      );

      logger.warn(
        `Retry attempt ${attempt}/${opts.retries} failed. Retrying in ${
          delay / 1000
        }s...`,
        {
          error: lastError.message,
          attempt,
          delay,
        }
      );

      if (opts.onRetry) {
        opts.onRetry(lastError, attempt);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Utility function to retry an async operation with exponential backoff and circuit breaking
 * @param operation The async operation to retry
 * @param options Retry configuration options
 * @param circuitKey The key to use for circuit breaking
 * @returns The result of the operation
 * @throws The last error encountered if all retries fail or circuit is open
 */
export async function retryWithCircuitBreaker<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {},
  circuitKey: string
): Promise<T> {
  // Check if circuit is open
  const isCircuitOpen = await checkCircuitBreaker(circuitKey);
  if (isCircuitOpen) {
    throw new Error('Circuit breaker is open');
  }

  try {
    return await retry(operation, options);
  } catch (error) {
    // Record failure and potentially open circuit
    await recordCircuitBreakerFailure(circuitKey);
    throw error;
  }
}

/**
 * Check if a circuit breaker is open
 * @param key The circuit breaker key
 * @returns True if the circuit is open, false otherwise
 */
async function checkCircuitBreaker(key: string): Promise<boolean> {
  // Implementation would typically use Redis to track circuit state
  return false;
}

/**
 * Record a failure for a circuit breaker
 * @param key The circuit breaker key
 */
async function recordCircuitBreakerFailure(key: string): Promise<void> {
  // Implementation would typically use Redis to track failures
  // and open the circuit if threshold is exceeded
} 