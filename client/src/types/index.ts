/**
 * Main export point for all VoiceAI types
 */

export * from './audio';
export * from './client';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Dictionary<T = unknown> = Record<string, T>;

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

// Error types
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Dictionary<unknown>;
  timestamp: Date;
}

export type Result<T, E = ApiError> = 
  | { success: true; data: T }
  | { success: false; error: E };

export interface AgentConfig {
  id: string;
  websocketUrl: string;
  apiUrl: string;
  authToken: string;
  voice: string;
  speakingRate: number;
  pitch: number;
  language: string;
  firstMessage?: string;
}

export type AgentState = 'idle' | 'initializing' | 'active' | 'error';

export interface Call {
  id: string;
  status: 'connecting' | 'active' | 'ended' | 'error';
  startTime: Date;
  endTime?: Date;
  participants: string[];
  metadata?: Record<string, unknown>;
}

export interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: number;
}

export interface AudioContextType {
  playAudio: (audioData: ArrayBuffer) => Promise<void>;
  stopAudio: () => void;
  isPlaying: boolean;
}