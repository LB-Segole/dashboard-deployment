/**
 * useWebSocket Hook
 * Manages WebSocket connections and real-time data
 */

import { useState, useEffect, useCallback } from 'react';
import { WebSocketService } from '../services/websocketservice';

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [wsService, setWsService] = useState<WebSocketService | null>(null);

  const connect = useCallback(() => {
    const service = new WebSocketService(url);
    setWsService(service);

    service.onOpen(() => {
      setIsConnected(true);
      setError(null);
    });

    service.onMessage((message) => {
      setData(JSON.parse(message.data));
    });

    service.onError((err) => {
      setError(err.message);
      setIsConnected(false);
    });

    service.onClose(() => {
      setIsConnected(false);
    });

    return () => {
      service.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (wsService && isConnected) {
      wsService.send(JSON.stringify(message));
    }
  }, [wsService, isConnected]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return { data, isConnected, error, sendMessage };
};