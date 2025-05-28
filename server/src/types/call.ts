export enum CallStatus {
  INITIATED = 'initiated',
  RINGING = 'ringing',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  NO_ANSWER = 'no-answer',
  BUSY = 'busy',
  CANCELED = 'canceled',
}

export enum CallDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export interface CallEvent {
  AccountSid: string;
  CallSid: string;
  From: string;
  To: string;
  CallStatus: CallStatus;
  Direction: CallDirection;
  Timestamp: string;
  CallDuration?: number;
  RecordingUrl?: string;
  RecordingDuration?: number;
  RecordingSid?: string;
  EventType:
    | 'initiated'
    | 'ringing'
    | 'answered'
    | 'completed'
    | 'recording-completed'
    | 'machine-detection-complete';
  MachineDetectionResult?: 'machine' | 'human' | 'unknown';
  ErrorCode?: string;
  ErrorMessage?: string;
  CustomParameters?: Record<string, string>;
}

export interface CallRecording {
  recordingSid: string;
  callSid: string;
  url: string;
  duration: number;
  channels: number;
  status: 'completed' | 'failed';
  errorCode?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Call {
  id: string;
  signalwireCallSid: string;
  userId: string;
  agentId: string;
  from: string;
  to: string;
  direction: CallDirection;
  status: CallStatus;
  duration?: number;
  startTime: Date;
  answeredAt?: Date;
  endTime?: Date;
  recordingUrl?: string;
  recordingDuration?: number;
  transcriptionText?: string;
  transcriptionStatus?: 'pending' | 'completed' | 'failed';
  sentiment?: 'positive' | 'negative' | 'neutral';
  notes?: string;
  tags?: string[];
  customData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallMetrics {
  totalCalls: number;
  totalDuration: number;
  averageDuration: number;
  successRate: number;
  callsByStatus: Record<CallStatus, number>;
  callsByHour: Record<number, number>;
  topCallers: Array<{
    phoneNumber: string;
    callCount: number;
  }>;
} 