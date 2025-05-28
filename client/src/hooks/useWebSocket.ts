import { useState, useEffect, useCallback } from 'react';

type WebSocketMessage = {
  type: string;
  data: unknown;
  timestamp: number;
};

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

type WebSocketHook = {
  status: WebSocketStatus;
  messages: WebSocketMessage[];
  send: (message: WebSocketMessage) => void;
  connect: () => void;
  disconnect: () => void;
  error: string | null;
};

export const useWebSocket = (url: string): WebSocketHook => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (socket) return;

    setStatus('connecting');
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setStatus('connected');
      setError(null);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, {
          ...message,
          timestamp: Date.now(),
        }]);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (event) => {
      setStatus('error');
      setError('WebSocket connection error');
      console.error('WebSocket error:', event);
    };

    ws.onclose = () => {
      setStatus('disconnected');
      setSocket(null);
    };

    setSocket(ws);
  }, [url, socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
    }
  }, [socket]);

  const send = useCallback((message: WebSocketMessage) => {
    if (socket && status === 'connected') {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message - WebSocket not connected');
    }
  }, [socket, status]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return {
    status,
    messages,
    send,
    connect,
    disconnect,
    error,
  };
};