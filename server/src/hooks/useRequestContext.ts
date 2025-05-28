import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';
import { ContextData } from '../context/types';

const contextStorage = new AsyncLocalStorage<ContextData>();

export function useRequestContext() {
  const getCurrentContext = (): ContextData | undefined => {
    return contextStorage.getStore();
  };

  const createContext = (data: Partial<ContextData>): ContextData => {
    return {
      requestId: uuidv4(),
      startTime: Date.now(),
      ...data,
    };
  };

  const runWithContext = <T>(context: ContextData, fn: () => T): T => {
    return contextStorage.run(context, fn);
  };

  const getRequestId = (): string | undefined => {
    return getCurrentContext()?.requestId;
  };

  const getUserId = (): string | undefined => {
    return getCurrentContext()?.userId;
  };

  const getUser = (): ContextData['user'] | undefined => {
    return getCurrentContext()?.user;
  };

  const getStartTime = (): number | undefined => {
    return getCurrentContext()?.startTime;
  };

  const getCorrelationId = (): string | undefined => {
    return getCurrentContext()?.correlationId;
  };

  const getClientIp = (): string | undefined => {
    return getCurrentContext()?.clientIp;
  };

  const getUserAgent = (): string | undefined => {
    return getCurrentContext()?.userAgent;
  };

  return {
    getCurrentContext,
    createContext,
    runWithContext,
    getRequestId,
    getUserId,
    getUser,
    getStartTime,
    getCorrelationId,
    getClientIp,
    getUserAgent,
  };
} 