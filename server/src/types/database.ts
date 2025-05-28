// Remove incorrect imports from @prisma/client and define local enums/types if needed
// Example enums (customize as needed for your app):
export type AgentPersona = 'default' | 'custom';
export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed';
export type VoiceModel = 'standard' | 'premium';

export type AgentWithCalls = {
  id: string;
  name: string;
  voiceModel: VoiceModel;
  persona: AgentPersona;
  initialMessage: string;
  voiceSettings: Record<string, unknown>;
  calls: { id: string }[];
};

export type CallWithAgent = {
  id: string;
  phoneNumber: string;
  direction: CallDirection;
  status: CallStatus;
  duration: number | null;
  createdAt: Date;
  agent: { name: string };
};

export type TranscriptWithCall = {
  id: string;
  rawText: string;
  utterances: unknown[];
  diarization: unknown[];
  createdAt: Date;
  call: { phoneNumber: string; duration: number | null };
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  createdAt: Date;
};