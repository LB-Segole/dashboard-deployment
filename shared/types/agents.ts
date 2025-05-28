/**
 * Voice Agent Type Definitions
 */

export enum AgentStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

export enum AgentLanguage {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de',
}

export interface VoiceAgent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  language: AgentLanguage;
  voiceModel: string;
  llmModel: string;
  sttModel: string;
  ttsModel: string;
  temperature: number;
  prompt: string;
  webhookUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AgentConfig = Pick<
  VoiceAgent,
  | 'language'
  | 'voiceModel'
  | 'llmModel'
  | 'sttModel'
  | 'ttsModel'
  | 'temperature'
  | 'prompt'
>;

export type CreateAgentDTO = Omit<VoiceAgent, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAgentDTO = Partial<CreateAgentDTO>;