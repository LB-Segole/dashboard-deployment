export interface CallInitiationParams {
  to: string;
  from: string;
  agentId: string;
  callId: string;
}

export interface CallStatusEvent {
  CallSid: string;
  CallStatus: 
    | 'queued'
    | 'ringing'
    | 'in-progress'
    | 'completed'
    | 'busy'
    | 'failed'
    | 'no-answer';
  From: string;
  To: string;
  Direction: 'inbound' | 'outbound';
  Timestamp: string;
  CallDuration?: string;
  RecordingUrl?: string;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
}

export interface VoiceResponseOptions {
  voice?: 'man' | 'woman' | 'alice';
  language?: string;
  speed?: number;
}