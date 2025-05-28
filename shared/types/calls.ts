/**
 * Call-related Type Definitions
 */

export enum CallDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum CallStatus {
  INITIATED = 'initiated',
  RINGING = 'ringing',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  BUSY = 'busy',
  NO_ANSWER = 'no_answer',
}

export interface CallParticipant {
  phoneNumber: string;
  name?: string;
  role: 'caller' | 'callee' | 'agent';
}

export interface CallRecord {
  id: string;
  sessionId: string;
  direction: CallDirection;
  status: CallStatus;
  participants: CallParticipant[];
  startTime: Date;
  endTime?: Date;
  duration?: number;
  recordingUrl?: string;
  transcriptId?: string;
  metadata?: Record<string, unknown>;
}

export type CallAnalytics = {
  sentimentScore: number;
  keywords: string[];
  topics: string[];
  silenceDuration: number;
  talkRatio: number;
  interruptions: number;
};

export type RealTimeCallData = {
  sessionId: string;
  transcript: string;
  isSpeaking: boolean;
  emotions?: Record<string, number>;
  latency: number;
  timestamp: Date;
};