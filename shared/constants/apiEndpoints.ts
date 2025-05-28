/**
 * VoiceAI API Endpoints
 * Consolidated endpoint configuration for the entire application
 */

export const APIEndpoints = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  VOICE_AGENTS: {
    BASE: '/voice-agents',
    DEPLOY: '/voice-agents/deploy',
    CONFIG: '/voice-agents/config',
    ANALYTICS: '/voice-agents/analytics',
  },
  CALLS: {
    BASE: '/calls',
    RECORDINGS: '/calls/recordings',
    TRANSCRIPTS: '/calls/transcripts',
    REAL_TIME: '/calls/real-time',
  },
  INTEGRATIONS: {
    CRM: '/integrations/crm',
    CALENDAR: '/integrations/calendar',
    SUPPORT: '/integrations/support',
  },
  ADMIN: {
    USERS: '/admin/users',
    METRICS: '/admin/metrics',
    SETTINGS: '/admin/settings',
  },
} as const;

export type APIEndpoint = {
  [K in keyof typeof APIEndpoints]: {
    [P in keyof typeof APIEndpoints[K]]: string;
  };
};