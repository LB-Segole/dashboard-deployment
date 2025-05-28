/**
 * Audio-related types for VoiceAI platform
 */

export type AudioFormat = 'wav' | 'mp3' | 'ogg' | 'aac';
export type AudioQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface AudioSettings {
  format: AudioFormat;
  quality: AudioQuality;
  sampleRate?: number;
  channelCount?: 1 | 2;
  volume: number; // 0-100
  noiseReduction: boolean;
  echoCancellation: boolean;
}

export interface AudioStream {
  id: string;
  stream: MediaStream;
  startTime: Date;
  lastActive: Date;
  metadata: {
    deviceId?: string;
    codec?: string;
    bitrate?: number;
  };
}

export interface CallRecording {
  id: string;
  callId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  format: AudioFormat;
  size: number; // in bytes
  url?: string;
  transcriptionId?: string;
}

export interface AudioDevice {
  id: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
  isDefault: boolean;
  isActive: boolean;
}