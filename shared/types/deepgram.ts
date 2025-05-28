/**
 * Deepgram Integration Type Definitions
 */

export interface DeepgramTranscriptionConfig {
  model?: string;
  tier?: string;
  language?: string;
  punctuate?: boolean;
  profanity_filter?: boolean;
  redact?: boolean;
  diarize?: boolean;
  smart_format?: boolean;
  interim_results?: boolean;
  endpointing?: boolean;
  vad_turnoff?: number;
}

export interface DeepgramTranscriptionResponse {
  metadata: {
    request_id: string;
    created: string;
    duration: number;
    channels: number;
  };
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
        confidence: number;
        words: Array<{
          word: string;
          start: number;
          end: number;
          confidence: number;
          speaker?: number;
        }>;
      }>;
    }>;
  };
}