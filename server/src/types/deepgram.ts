export interface DeepgramTranscription {
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
    utterances?: Array<{
      start: number;
      end: number;
      confidence: number;
      channel: number;
      transcript: string;
      words: Array<{
        word: string;
        start: number;
        end: number;
        confidence: number;
        speaker?: number;
      }>;
    }>;
    diarization?: {
      speakers: Array<{
        speaker: number;
        words: Array<{
          word: string;
          start: number;
          end: number;
          confidence: number;
        }>;
      }>;
    };
  };
}

export interface LiveTranscriptionOptions {
  punctuate?: boolean;
  diarize?: boolean;
  interim_results?: boolean;
  endpointing?: boolean;
  vad_turnoff?: number;
}