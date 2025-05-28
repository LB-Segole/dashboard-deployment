/**
 * VoiceAI API Endpoints
 * All API routes for the VoiceAI platform
 */

import { APIConfig } from './apiconfig';

export const APIEndpoints = {
  AUTH: {
    LOGIN: `${APIConfig.BASE_URL}/auth/login`,
    REGISTER: `${APIConfig.BASE_URL}/auth/register`,
    REFRESH: `${APIConfig.BASE_URL}/auth/refresh`,
    LOGOUT: `${APIConfig.BASE_URL}/auth/logout`,
    PROFILE: `${APIConfig.BASE_URL}/auth/profile`,
  },

  VOICE: {
    AGENTS: `${APIConfig.BASE_URL}/voice/agents`,
    CALLS: `${APIConfig.BASE_URL}/voice/calls`,
    RECORDINGS: `${APIConfig.BASE_URL}/voice/recordings`,
    TRANSCRIPTS: `${APIConfig.BASE_URL}/voice/transcripts`,
    ANALYTICS: `${APIConfig.BASE_URL}/voice/analytics`,
  },

  INTEGRATIONS: {
    CRM: `${APIConfig.BASE_URL}/integrations/crm`,
    CALENDAR: `${APIConfig.BASE_URL}/integrations/calendar`,
    SUPPORT: `${APIConfig.BASE_URL}/integrations/support`,
  },

  ADMIN: {
    USERS: `${APIConfig.BASE_URL}/admin/users`,
    BILLING: `${APIConfig.BASE_URL}/admin/billing`,
    METRICS: `${APIConfig.BASE_URL}/admin/metrics`,
    SETTINGS: `${APIConfig.BASE_URL}/admin/settings`,
  },

  BILLING: {
    PLANS: `${APIConfig.BASE_URL}/billing/plans`,
    SUBSCRIPTIONS: `${APIConfig.BASE_URL}/billing/subscriptions`,
    INVOICES: `${APIConfig.BASE_URL}/billing/invoices`,
  },
};

export type APIEndpointKey = keyof typeof APIEndpoints;
export type APIEndpointPath = typeof APIEndpoints[keyof typeof APIEndpoints];