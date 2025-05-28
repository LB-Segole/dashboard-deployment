// Stub for integration types
export type IntegrationType = 'slack' | 'teams' | 'zoom' | 'custom';
export interface IntegrationConfig {
  id: string;
  type: IntegrationType;
  enabled: boolean;
  config: Record<string, any>;
}

export interface DeepgramTranscriptionConfig {
  language: string;
  model: string;
  punctuate?: boolean;
}

export interface DeepgramTranscriptionResponse {
  transcript: string;
  confidence: number;
  words: Array<{ word: string; start: number; end: number; confidence: number }>;
} 