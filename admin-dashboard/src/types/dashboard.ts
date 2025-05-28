// types/dashboard.ts
export interface AnalyticsData {
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  averageDuration: number;
  uniqueCallers: number;
  callVolume: Array<{
    date: string;
    count: number;
  }>;
  topAgents: Array<{
    agentId: string;
    agentName: string;
    callsHandled: number;
    satisfactionScore: number;
  }>;
}

export interface CallAnalytics {
  total: number;
  answered: number;
  missed: number;
  averageDuration: number;
  byHour?: Array<{
    hour: string;
    count: number;
  }>;
  byDay?: Array<{
    day: string;
    count: number;
  }>;
  byAgent?: Array<{
    agentId: string;
    agentName: string;
    count: number;
  }>;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  callsHandled: number;
  averageHandleTime: number;
  firstCallResolution: number;
  customerSatisfaction: number;
  availability: number;
}

export interface Call {
  id: string;
  callerNumber: string;
  callerName?: string;
  agentId: string;
  agentName: string;
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed';
  direction: 'inbound' | 'outbound';
  duration?: number;
  startedAt: string;
  endedAt?: string;
  recordingAvailable: boolean;
  transcriptAvailable: boolean;
  satisfactionScore?: number;
  tags?: string[];
}

export interface CallRecording {
  id: string;
  callId: string;
  url: string;
  duration: number;
  format: 'mp3' | 'wav';
  createdAt: string;
}

export interface CallTranscript {
  id: string;
  callId: string;
  text: string;
  segments: Array<{
    speaker: 'agent' | 'caller';
    text: string;
    timestamp: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
  }>;
  summary?: string;
  createdAt: string;
}