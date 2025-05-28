import { EventEmitter } from 'events';

export type WebSocketStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: number;
}

interface WebSocketConfig {
  url: string;
  token: string;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

class VoiceAIWebSocket extends EventEmitter {
  private socket: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectCount = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    super();
    this.config = {
      reconnectAttempts: 3,
      reconnectInterval: 5000,
      ...config
    };
  }

  public connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.socket = new WebSocket(this.config.url);
      this.setupSocketListeners();
    } catch (error) {
      this.handleError(error);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.clearReconnectTimer();
      this.socket.close();
      this.socket = null;
      this.reconnectCount = 0;
    }
  }

  public send(message: Omit<WebSocketMessage, 'timestamp'>): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: Date.now()
    };

    try {
      this.socket.send(JSON.stringify(fullMessage));
    } catch (error) {
      this.handleError(error);
    }
  }

  public getStatus(): WebSocketStatus {
    if (!this.socket) return 'disconnected';
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
      default:
        return 'disconnected';
    }
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.reconnectCount = 0;
      this.emit('open');
      
      // Send authentication message
      this.send({
        type: 'auth',
        payload: { token: this.config.token }
      });
    };

    this.socket.onclose = () => {
      this.emit('close');
      this.handleReconnect();
    };

    this.socket.onerror = (event) => {
      this.handleError(event);
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.emit('message', message);
      } catch (error) {
        this.handleError(new Error('Failed to parse WebSocket message'));
      }
    };
  }

  private handleError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown WebSocket error';
    this.emit('error', new Error(errorMessage));
  }

  private handleReconnect(): void {
    if (this.reconnectCount >= (this.config.reconnectAttempts ?? 3)) {
      this.emit('error', new Error('Max reconnection attempts reached'));
      return;
    }

    this.clearReconnectTimer();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectCount++;
      this.connect();
    }, this.config.reconnectInterval);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// Singleton instance
let websocketInstance: VoiceAIWebSocket | null = null;

export const initWebSocket = (url: string, token: string): VoiceAIWebSocket => {
  if (!websocketInstance) {
    websocketInstance = new VoiceAIWebSocket({ url, token });
  }
  return websocketInstance;
};

export const getWebSocket = (): VoiceAIWebSocket => {
  if (!websocketInstance) {
    throw new Error('WebSocket has not been initialized');
  }
  return websocketInstance;
};

export const closeWebSocket = (): void => {
  if (websocketInstance) {
    websocketInstance.disconnect();
    websocketInstance = null;
  }
};

// React Hook
import { useState, useEffect, useCallback } from 'react';

export const useWebSocket = (url: string, token: string) => {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ws = initWebSocket(url, token);

    const onOpen = () => {
      setStatus('connected');
      setError(null);
    };

    const onClose = () => {
      setStatus('disconnected');
    };

    const onError = (err: Error) => {
      setStatus('error');
      setError(err);
    };

    const onMessage = (msg: WebSocketMessage) => {
      setMessages(prev => [...prev, msg]);
    };

    ws.on('open', onOpen);
    ws.on('close', onClose);
    ws.on('error', onError);
    ws.on('message', onMessage);

    ws.connect();

    return () => {
      ws.off('open', onOpen);
      ws.off('close', onClose);
      ws.off('error', onError);
      ws.off('message', onMessage);
      closeWebSocket();
    };
  }, [url, token]);

  const send = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    try {
      const ws = getWebSocket();
      ws.send(message);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to send message'));
    }
  }, []);

  return {
    status,
    messages,
    error,
    send,
    connect: () => getWebSocket().connect(),
    disconnect: () => closeWebSocket()
  };
};