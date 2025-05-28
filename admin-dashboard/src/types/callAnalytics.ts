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
  analysis: CallAnalyticsData;
  loading: boolean;
  error: string | null;
}

export interface TranscriptLine {
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface CallTranscript {
  lines: TranscriptLine[];
  summary?: string;
} 