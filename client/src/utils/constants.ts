/**
 * Application constants for VoiceAI platform
 */

export const APP_NAME = 'VoiceAI';
export const APP_DESCRIPTION = 'Professional AI Voice Calling Agent';
export const COMPANY_NAME = 'VoiceAI Technologies';

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.voiceai.tech/v1';
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  CALLS: {
    BASE: '/calls',
    START: '/calls/start',
    END: '/calls/end',
    RECORDINGS: '/calls/recordings',
  },
  AGENTS: {
    BASE: '/agents',
    CONFIG: '/agents/config',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
  },
};

// Audio constants
export const AUDIO_CONSTANTS = {
  DEFAULT_SAMPLE_RATE: 16000,
  DEFAULT_CHANNELS: 1,
  MAX_RECORDING_DURATION: 3600, // 1 hour in seconds
  VOLUME_THRESHOLD: 0.1, // Minimum volume to consider as speech
  SILENCE_TIMEOUT: 3000, // 3 seconds of silence to consider as pause
};

// Call status constants
export const CALL_STATUS = {
  IDLE: 'idle',
  INITIATING: 'initiating',
  RINGING: 'ringing',
  ACTIVE: 'active',
  ENDED: 'ended',
  FAILED: 'failed',
} as const;

// UI constants
export const UI = {
  MAX_CONTAINER_WIDTH: 'max-w-7xl',
  DEFAULT_TRANSITION: 'transition-all duration-200 ease-in-out',
  MODAL_ANIMATION_DURATION: 300, // ms
  TOAST_DURATION: 5000, // ms
};

// Feature flags
export const FEATURE_FLAGS = {
  REALTIME_TRANSCRIPTION: true,
  MULTILINGUAL_SUPPORT: true,
  CALL_RECORDING: true,
  ADVANCED_ANALYTICS: false, // Coming soon
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'voiceai_auth_token',
  USER_PREFERENCES: 'voiceai_user_prefs',
  RECENT_CALLS: 'voiceai_recent_calls',
};