import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger, requestLogger } from './utils/logger';
import { ErrorHandler } from './middleware/error-handler';
import apiRoutes from './routes';
import { SocketHandler } from './websocket/socketHandler';
import { AuthenticatedRequest } from './types/express';
import { createContextMiddleware } from './context';

export const createApp = (): express.Application => {
  const app = express();

  // Trust proxy in production
  if (config.isProduction) {
    app.set('trust proxy', true);
  }

  // Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: config.app.corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Request context middleware - add before request logging
  app.use(createContextMiddleware({
    correlationIdHeader: 'x-correlation-id',
    includeUser: true
  }));

  // Request logging
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => requestLogger.info(message.trim()),
      },
    })
  );

  app.use(compression());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // API routes
  app.use('/api', apiRoutes);

  // Static files in production
  if (config.isProduction) {
    app.use(express.static('public'));
  }

  // 404 handler
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
  });

  // Error handler
  app.use(ErrorHandler);

  return app;
};

export const setupWebSocket = (server: any) => {
  return new SocketHandler(server);
};

export type App = {
  express: express.Application;
  socketHandler: SocketHandler;
};

export const initializeApp = (): App => {
  const expressApp = createApp();
  const server = expressApp.listen(config.app.port, () => {
    logger.info(`Server running on port ${config.app.port}`);
  });

  const socketHandler = setupWebSocket(server);

  return {
    express: expressApp,
    socketHandler,
  };
};