// types/callAnalytics.ts

export interface CallAnalyticsData {
  sentimentOverTime: Array<{
    timestamp: number;
    score: number;
  }>;
  overallSentiment: {
    score: number;
    label: string;
  };
  customerSentiment: {
    score: number;
    label: string;
  };
  agentSentiment: {
    score: number;
    label: string;
  };
  topics: Array<{
    name: string;
    count: number;
    sentiment: number;
  }>;
  metrics: {
    talkListenRatio: number;
    interruptions: number;
    interruptionsPerMinute: number;
    silencePercentage: number;
  };
}

export interface CallAnalysis {
  overallSentiment: {
    score: number;
    label: string;
  };
  customerSentiment: {
    score: number;
    label: string;
  };
  agentSentiment: {
    score: number;
    label: string;
  };
  topics: Array<{
    topic: string;
    confidence: number;
  }>;
  metrics: {
    talkListenRatio: number;
    interruptions: number;
    interruptionsPerMinute: number;
    silencePercentage: number;
  };
  sentimentOverTime: Array<{
    timestamp: number;
    sentiment: number;
  }>;
}

export interface CallAnalyticsParams {
  dateRange?: {
    start: string;
    end: string;
  };
  status?: 'completed' | 'failed' | 'all';
}

export interface CallAnalyticsData {
  callVolume: Array<{
    date: string;
    count: number;
  }>;
  callDuration: Array<{
    duration: string;
    count: number;
  }>;
  callOutcomes: Array<{
    outcome: string;
    count: number;
  }>;
}

export interface APIMetrics {
  apiCalls: Array<{
    endpoint: string;
    count: number;
  }>;
  processingTime: Array<{
    endpoint: string;
    time: number;
  }>;
}

export interface TranscriptLine {
  speaker: string;
  text: string;
  timestamp: number;
}

export interface CallTranscript {
  lines: TranscriptLine[];
  summary?: string;
} 