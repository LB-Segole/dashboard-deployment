/**
 * Supported API Providers
 * Configuration for third-party API integrations
 */

export const APIProviders = {
  VOICE: {
    DEEPGRAM: 'deepgram',
    TWILIO: 'twilio',
    SIGNALWIRE: 'signalwire',
    AWS_POLLY: 'aws_polly',
  },
  LLM: {
    OPENAI: 'openai',
    ANTHROPIC: 'anthropic',
    COHERE: 'cohere',
  },
  STT: {
    WHISPER: 'whisper',
    GOOGLE: 'google',
    AZURE: 'azure',
  },
} as const;

export type APIProviderType = {
  [K in keyof typeof APIProviders]: typeof APIProviders[K][keyof typeof APIProviders[K]];
};