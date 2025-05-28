export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    isOperational: boolean = true,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error types
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 409, 'CONFLICT_ERROR', true, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

export class IntegrationError extends AppError {
  constructor(message: string, service: string, details?: Record<string, any>) {
    super(
      message,
      502,
      'INTEGRATION_ERROR',
      true,
      { service, ...details }
    );
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR', false);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(`${service} service error: ${message}`, 503, 'EXTERNAL_SERVICE_ERROR');
  }
}

export class OpenAIError extends ExternalServiceError {
  constructor(message: string) {
    super('OpenAI', message);
  }
}

export class SignalWireError extends ExternalServiceError {
  constructor(message: string) {
    super('SignalWire', message);
  }
}

// Error factory
export const createError = {
  validation: (message: string, details?: Record<string, any>) => new ValidationError(message, details),
  authentication: (message?: string) => new AuthenticationError(message),
  authorization: (message?: string) => new AuthorizationError(message),
  notFound: (message?: string) => new NotFoundError(message),
  conflict: (message: string, details?: Record<string, any>) => new ConflictError(message, details),
  rateLimit: (message?: string) => new RateLimitError(message),
  database: (message: string) => new DatabaseError(message),
  openai: (message: string) => new OpenAIError(message),
  signalwire: (message: string) => new SignalWireError(message),
  integration: (message: string, service: string, details?: Record<string, any>) => new IntegrationError(message, service, details),
}; 