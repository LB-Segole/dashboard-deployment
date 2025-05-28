export interface CallDetails {
  id: string;
  agentId: string;
  from: { number: string };
  to: { number: string };
  startTime: string;
  duration: number;
  status: string;
} 