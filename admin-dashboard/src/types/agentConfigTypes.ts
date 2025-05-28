export interface AgentConfig {
  name: string;
  personality: string;
  voice: string;
  language: string;
  instructions: string;
  maxResponseTime: number;
  temperature: number;
  isActive: boolean;
} 