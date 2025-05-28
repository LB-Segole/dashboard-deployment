/**
 * WebSocket Service
 * Manages WebSocket connections with reconnection logic
 */

type MessageHandler = (message: MessageEvent) => void;
type ErrorHandler = (error: Event) => void;
type OpenHandler = () => void;
type CloseHandler = () => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private messageHandlers: MessageHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private openHandlers: OpenHandler[] = [];
  private closeHandlers: CloseHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.openHandlers.forEach(handler => handler());
    };

    this.socket.onmessage = (message) => {
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.socket.onerror = (error) => {
      this.errorHandlers.forEach(handler => handler(error));
    };

    this.socket.onclose = () => {
      this.closeHandlers.forEach(handler => handler());
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay);
    }
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  onError(handler: ErrorHandler) {
    this.errorHandlers.push(handler);
  }

  onOpen(handler: OpenHandler) {
    this.openHandlers.push(handler);
  }

  onClose(handler: CloseHandler) {
    this.closeHandlers.push(handler);
  }

  send(data: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}