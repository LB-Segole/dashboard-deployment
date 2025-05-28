export interface CallDetails {
  id: string;
  status: 'queued' | 'in-progress' | 'completed' | 'failed';
  duration: number;
  startTime: string;
  endTime: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  agentId: string;
  agentName: string;
  cost: number;
  recordingUrl?: string;
  audioUrl?: string;
  transcript?: string;
  transcriptId?: string;
  metadata?: Record<string, unknown>;
}

export interface CallSummary {
  id: string;
  status: CallDetails['status'];
  duration: number;
  startTime: string;
  from: string;
  to: string;
  agentName: string;
}

export interface CallFilters {
  status?: CallDetails['status'];
  direction?: CallDetails['direction'];
  agentId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface CallStats {
  totalCalls: number;
  averageDuration: number;
  successRate: number;
  totalCost: number;
  callsByStatus: Record<CallDetails['status'], number>;
  callsByDirection: Record<CallDetails['direction'], number>;
} 