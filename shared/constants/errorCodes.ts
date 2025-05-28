/**
 * VoiceAI Error Codes
 * Standardized error codes for API responses and client-side handling
 */

export const ErrorCodes = {
  // Authentication Errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_TOKEN_INVALID: 'AUTH_003',
  AUTH_PERMISSION_DENIED: 'AUTH_004',

  // Validation Errors
  VALIDATION_FAILED: 'VALID_001',
  VALIDATION_INVALID_EMAIL: 'VALID_002',
  VALIDATION_INVALID_PHONE: 'VALID_003',

  // Resource Errors
  RESOURCE_NOT_FOUND: 'RES_001',
  RESOURCE_ALREADY_EXISTS: 'RES_002',
  RESOURCE_LIMIT_EXCEEDED: 'RES_003',

  // Payment Errors
  PAYMENT_FAILED: 'PAY_001',
  PAYMENT_CARD_DECLINED: 'PAY_002',
  PAYMENT_SUBSCRIPTION_EXPIRED: 'PAY_003',

  // System Errors
  SERVER_ERROR: 'SYS_001',
  SERVICE_UNAVAILABLE: 'SYS_002',
  MAINTENANCE_MODE: 'SYS_003',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid credentials provided',
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Authentication token has expired',
  [ErrorCodes.AUTH_TOKEN_INVALID]: 'Invalid authentication token',
  [ErrorCodes.AUTH_PERMISSION_DENIED]: 'Permission denied',
  
  [ErrorCodes.VALIDATION_FAILED]: 'Validation failed',
  [ErrorCodes.VALIDATION_INVALID_EMAIL]: 'Invalid email address',
  [ErrorCodes.VALIDATION_INVALID_PHONE]: 'Invalid phone number',
  
  [ErrorCodes.RESOURCE_NOT_FOUND]: 'Requested resource not found',
  [ErrorCodes.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [ErrorCodes.RESOURCE_LIMIT_EXCEEDED]: 'Resource limit exceeded',
  
  [ErrorCodes.PAYMENT_FAILED]: 'Payment processing failed',
  [ErrorCodes.PAYMENT_CARD_DECLINED]: 'Card declined',
  [ErrorCodes.PAYMENT_SUBSCRIPTION_EXPIRED]: 'Subscription expired',
  
  [ErrorCodes.SERVER_ERROR]: 'Internal server error',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
  [ErrorCodes.MAINTENANCE_MODE]: 'System under maintenance',
};