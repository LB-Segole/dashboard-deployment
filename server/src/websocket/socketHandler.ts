import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../utils/Logger';
import { config } from '../config';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';
import { z } from 'zod';

// Event validation schemas
const messageSchema = z.object({
  type: z.enum(['text', 'audio']),
  content: z.string(),
  timestamp: z.number().optional(),
});

const callEventSchema = z.object({
  callId: z.string(),
  status: z.enum(['started', 'connected', 'ended', 'failed']),
  timestamp: z.number().optional(),
  error: z.string().optional(),
});

export class SocketHandler {
  private io: Server;
  private activeSockets: Map<string, Socket> = new Map();
  private heartbeatInterval = 30000; // 30 seconds

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: config.allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 10000,
      pingInterval: 5000,
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    this.startHeartbeat();

    logger.info('WebSocket server initialized');
  }

  private setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new AppError('Authentication required', 401);
        }

        const decoded = await verifyToken(token);
        socket.data.user = decoded;
        next();
      } catch (error) {
        logger.error('WebSocket authentication error:', error);
        next(new AppError('Invalid authentication', 401));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);

      socket.on('message', (data) => this.handleMessage(socket, data));
      socket.on('call:event', (data) => this.handleCallEvent(socket, data));
      socket.on('disconnect', () => this.handleDisconnect(socket));
      socket.on('error', (error) => this.handleError(socket, error));
    });
  }

  private handleConnection(socket: Socket) {
    const userId = socket.data.user.id;
    this.activeSockets.set(userId, socket);

    logger.info(`Client connected: ${userId}`);
    socket.emit('connected', { userId });
  }

  private async handleMessage(socket: Socket, data: unknown) {
    try {
      const message = messageSchema.parse(data);
      const userId = socket.data.user.id;

      logger.debug('Received message:', { userId, message });

      // Broadcast to relevant users or process message
      this.io.emit('message', {
        userId,
        ...message,
        timestamp: message.timestamp || Date.now(),
      });
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async handleCallEvent(socket: Socket, data: unknown) {
    try {
      const event = callEventSchema.parse(data);
      const userId = socket.data.user.id;

      logger.debug('Received call event:', { userId, event });

      // Process call event and broadcast to relevant users
      this.io.emit('call:update', {
        userId,
        ...event,
        timestamp: event.timestamp || Date.now(),
      });
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private handleDisconnect(socket: Socket) {
    const userId = socket.data.user.id;
    this.activeSockets.delete(userId);
    logger.info(`Client disconnected: ${userId}`);
  }

  private handleError(socket: Socket, error: unknown) {
    const userId = socket.data?.user?.id;
    logger.error('WebSocket error:', { userId, error });

    if (error instanceof z.ZodError) {
      socket.emit('error', {
        message: 'Invalid message format',
        details: error.errors,
      });
    } else if (error instanceof AppError) {
      socket.emit('error', {
        message: error.message,
        code: error.code,
      });
    } else {
      socket.emit('error', {
        message: 'Internal server error',
      });
    }
  }

  private startHeartbeat() {
    setInterval(() => {
      this.activeSockets.forEach((socket, userId) => {
        socket.emit('ping');
        const start = Date.now();

        socket.once('pong', () => {
          const latency = Date.now() - start;
          logger.debug('Socket heartbeat:', { userId, latency });
        });

        // Set timeout for pong response
        setTimeout(() => {
          if (socket.listeners('pong').length > 0) {
            logger.warn('Socket heartbeat timeout:', { userId });
            socket.disconnect(true);
          }
        }, 5000);
      });
    }, this.heartbeatInterval);
  }

  public broadcast(event: string, data: unknown) {
    this.io.emit(event, data);
  }

  public sendToUser(userId: string, event: string, data: unknown) {
    const socket = this.activeSockets.get(userId);
    if (socket) {
      socket.emit(event, data);
    }
  }

  public getActiveUsers(): string[] {
    return Array.from(this.activeSockets.keys());
  }

  public disconnect() {
    this.io.close();
    this.activeSockets.clear();
    logger.info('WebSocket server closed');
  }
}

// Export function to close WebSocket connections
export const closeWebSocketConnections = async () => {
  return new Promise<void>((resolve) => {
    const wsServer = global.wsServer as SocketHandler | undefined;
    if (wsServer) {
      wsServer.disconnect();
      delete global.wsServer;
    }
    resolve();
  });
};