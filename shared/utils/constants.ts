/**
 * Application Constants
 */

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_CACHE_TTL = 300000; // 5 minutes
export const API_TIMEOUT = 30000; // 30 seconds
export const DEBOUNCE_DELAY = 300; // 300ms
export const THROTTLE_LIMIT = 1000; // 1 second
export const SESSION_TIMEOUT = 1800000; // 30 minutes

export const SUPPORTED_AUDIO_FORMATS = [
  'audio/wav',
  'audio/mpeg',
  'audio/ogg',
  'audio/webm',
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
];

export const TIMEZONES = Intl.supportedValuesOf('timeZone').map((tz) => ({
  value: tz,
  label: tz.replace(/_/g, ' '),
}));