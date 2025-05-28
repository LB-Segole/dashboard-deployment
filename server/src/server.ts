import { initializeApp } from './app';
import { logger } from './utils/Logger';
import { config } from './config';
import { prisma } from './lib/prisma';
import { Server } from 'http';
import { promisify } from 'util';
import { RedisClient } from './lib/redis';
import { closeWebSocketConnections } from './websocket/SocketHandler';

class ServerManager {
  private server: Server | null = null;
  private shuttingDown = false;

  async start(): Promise<void> {
    try {
      // Initialize app and server
      const { express: app, socketHandler } = initializeApp();
      this.server = app.listen(config.port);

      // Wait for server to start
      await new Promise<void>((resolve, reject) => {
        this.server?.once('listening', () => {
          logger.info(`VoiceAI server started in ${config.env} mode on port ${config.port}`);
          logger.info(`API docs available at /api/docs`);
          logger.info(`Health check at /health`);
          resolve();
        });
        this.server?.once('error', reject);
      });

      // Set up shutdown handlers
      const shutdownSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
      shutdownSignals.forEach((signal) => {
        process.once(signal, async () => {
          logger.info(`Received ${signal} signal`);
          await this.shutdown();
        });
      });

      // Set up error handlers
      process.on('uncaughtException', this.handleUncaughtError.bind(this));
      process.on('unhandledRejection', this.handleUnhandledRejection.bind(this));

    } catch (error) {
      logger.error('Failed to start server:', error);
      await this.shutdown(1);
    }
  }

  private async handleUncaughtError(error: Error): Promise<void> {
    logger.error('Uncaught Exception:', error);
    await this.shutdown(1);
  }

  private async handleUnhandledRejection(reason: unknown, promise: Promise<unknown>): Promise<void> {
    logger.error('Unhandled Rejection at:', { promise, reason });
    await this.shutdown(1);
  }

  private async shutdown(exitCode = 0): Promise<void> {
    if (this.shuttingDown) {
      return;
    }
    this.shuttingDown = true;

    logger.info('Starting graceful shutdown...');

    try {
      const shutdownTimeout = setTimeout(() => {
        logger.error('Shutdown timeout exceeded, forcing exit');
        process.exit(1);
      }, 10000);

      // Close server connections
      if (this.server) {
        logger.info('Closing HTTP server...');
        const closeServer = promisify(this.server.close.bind(this.server));
        await closeServer();
        logger.info('HTTP server closed');
      }

      // Close WebSocket connections
      logger.info('Closing WebSocket connections...');
      await closeWebSocketConnections();
      logger.info('WebSocket connections closed');

      // Close database connection
      logger.info('Closing database connection...');
      await prisma.$disconnect();
      logger.info('Database connection closed');

      // Close Redis connection if exists
      logger.info('Closing Redis connection...');
      await RedisClient.disconnect();
      logger.info('Redis connection closed');

      clearTimeout(shutdownTimeout);
      logger.info('Graceful shutdown completed');
      process.exit(exitCode);

    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Start the server
const serverManager = new ServerManager();
serverManager.start().catch((error) => {
  logger.error('Failed to initialize server:', error);
  process.exit(1);
});