import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';
import { ContextData } from './types';

export class RequestContext {
  private static storage = new AsyncLocalStorage<ContextData>();

  static getCurrentContext(): ContextData | undefined {
    return this.storage.getStore();
  }

  static create(data: Partial<ContextData>): ContextData {
    const context: ContextData = {
      requestId: uuidv4(),
      startTime: Date.now(),
      ...data
    };
    return context;
  }

  static run<T>(context: ContextData, fn: () => T): T {
    return this.storage.run(context, fn);
  }

  static get requestId(): string | undefined {
    return this.getCurrentContext()?.requestId;
  }

  static get userId(): string | undefined {
    return this.getCurrentContext()?.userId;
  }

  static get user(): ContextData['user'] | undefined {
    return this.getCurrentContext()?.user;
  }

  static get startTime(): number | undefined {
    return this.getCurrentContext()?.startTime;
  }

  static get correlationId(): string | undefined {
    return this.getCurrentContext()?.correlationId;
  }

  static get clientIp(): string | undefined {
    return this.getCurrentContext()?.clientIp;
  }

  static get userAgent(): string | undefined {
    return this.getCurrentContext()?.userAgent;
  }
} 