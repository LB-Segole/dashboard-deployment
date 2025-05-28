/**
 * Client-side types for VoiceAI platform
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  organizationId: string;
  role: 'admin' | 'user' | 'guest';
  lastActive?: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  audioSettings: {
    inputDevice?: string;
    outputDevice?: string;
    volume: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  language: string;
}

export interface CallSession {
  id: string;
  userId: string;
  agentId: string;
  startTime: Date;
  endTime?: Date;
  status: 'initiating' | 'ringing' | 'active' | 'ended' | 'failed';
  duration?: number; // in seconds
  recording?: CallRecording;
  transcript?: Transcript;
  metadata: {
    callerNumber?: string;
    calledNumber?: string;
    direction: 'inbound' | 'outbound';
    tags?: string[];
  };
}

export interface Transcript {
  id: string;
  callId: string;
  segments: TranscriptSegment[];
  fullText: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TranscriptSegment {
  id: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
  speaker: 'user' | 'agent';
  isFinal: boolean;
  confidence: number; // 0-1
}