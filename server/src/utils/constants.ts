export const JWT_EXPIRATION = '1h';
export const JWT_REFRESH_EXPIRATION = '7d';

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
};

export const AGENT_PERSONAS = [
  'FRIENDLY',
  'PROFESSIONAL',
  'SUPPORTIVE',
  'SALES',
  'TECHNICAL'
] as const;

export const VOICE_MODELS = [
  'MALE_1',
  'FEMALE_1',
  'MALE_2',
  'FEMALE_2',
  'NEUTRAL'
] as const;

export const CALL_STATUS = [
  'INITIATED',
  'RINGING',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
  'BUSY',
  'NO_ANSWER'
] as const;