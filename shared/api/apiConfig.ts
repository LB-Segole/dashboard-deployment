/**
 * VoiceAI API Configuration
 * Centralized configuration for API base URLs, headers, and default settings
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.voiceai.example.com/v1';
const DEFAULT_TIMEOUT = 15000; // 15 seconds

export const APIConfig = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: DEFAULT_TIMEOUT,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  AUTH_HEADER: 'Authorization',
  RETRY_COUNT: 2,
  RETRY_DELAY: 1000,
};

// Error codes that should trigger retry
export const RETRY_ERROR_CODES = [408, 429, 500, 502, 503, 504];

// Cache settings
export const CACHE_CONFIG = {
  ENABLED: true,
  DEFAULT_TTL: 300000, // 5 minutes
};

// Rate limiting config
export const RATE_LIMIT_CONFIG = {
  ENABLED: true,
  MAX_REQUESTS: 60,
  PER_MS: 60000, // 1 minute
};