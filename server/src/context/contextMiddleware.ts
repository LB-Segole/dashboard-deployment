import { Request, Response, NextFunction } from 'express';
import { RequestContext } from './RequestContext';
import { ContextData, ContextOptions, RequestWithContext } from './types';

export const createContextMiddleware = (options: ContextOptions = {}) => {
  const {
    correlationIdHeader = 'x-correlation-id',
    includeUser = true
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const contextData: Partial<ContextData> = {
      correlationId: req.header(correlationIdHeader),
      clientIp: req.ip,
      userAgent: req.header('user-agent'),
    };

    // Add user information if available and requested
    if (includeUser && (req as any).user) {
      contextData.userId = (req as any).user.id;
      contextData.user = (req as any).user;
    }

    const context = RequestContext.create(contextData);

    // Extend request with context
    (req as RequestWithContext).context = context;

    // Run the rest of the request in the context
    RequestContext.run(context, () => {
      // Add response hooks
      const originalEnd = res.end;
      const originalJson = res.json;

      // Override end to cleanup context
      res.end = function(chunk?: any, encoding?: any, cb?: any): Response {
        // Cleanup can be added here if needed
        return originalEnd.call(this, chunk, encoding, cb);
      };

      // Override json to add context info if needed
      res.json = function(body: any): Response {
        if (body && typeof body === 'object') {
          // Optionally add request context info to response
          // body._requestId = context.requestId;
        }
        return originalJson.call(this, body);
      };

      next();
    });
  };
}; 