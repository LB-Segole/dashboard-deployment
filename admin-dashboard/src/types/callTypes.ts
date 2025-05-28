export interface CallAnalyticsData {
  sentimentScore: number;
  customerSatisfaction: number;
  resolutionTime: number;
  conversationFlow: Array<{
    name: string;
    duration: number;
  }>;
  insights: string[];
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

export interface Call {
  id: string;
  agentId: string;
  from: { number: string };
  to: { number: string };
  startTime: string;
  duration: number;
  status: 'queued' | 'in-progress' | 'completed' | 'failed';
}

export interface CallAnalysis {
  analysis: CallAnalyticsData;
  loading: boolean;
  error: string | null;
} 