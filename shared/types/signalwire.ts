/**
 * SignalWire Integration Type Definitions
 */

export interface SignalWireCallOptions {
  from: string;
  to: string;
  timeout?: number;
  maxDuration?: number;
  record?: boolean;
  machineDetection?: boolean;
}

export interface SignalWireCallResponse {
  callId: string;
  status: string;
  direction: string;
  from: string;
  to: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  recordingUrl?: string;
}

export interface SignalWireWebhookPayload {
  call_id: string;
  call_status: string;
  direction: string;
  from: string;
  to: string;
  call_duration?: number;
  recording_url?: string;
  digits?: string;
  speech_result?: string;
}