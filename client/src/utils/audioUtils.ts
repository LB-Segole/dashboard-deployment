import type { AudioSettings, AudioDevice, AudioStream } from '@/types/audio';

/**
 * Audio utilities for VoiceAI platform
 */

// Get user media with error handling
export async function getUserAudio(settings: Partial<AudioSettings> = {}): Promise<MediaStream> {
  const constraints: MediaStreamConstraints = {
    audio: {
      noiseSuppression: settings.noiseReduction ?? true,
      echoCancellation: settings.echoCancellation ?? true,
      ...(settings.sampleRate && { sampleRate: settings.sampleRate }),
      ...(settings.channelCount && { channelCount: settings.channelCount }),
    },
    video: false,
  };

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    throw new AudioError('Failed to access microphone', error);
  }
}

// Get available audio devices
export async function getAudioDevices(): Promise<AudioDevice[]> {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    return devices
      .filter(device => device.kind === 'audioinput' || device.kind === 'audiooutput')
      .map(device => ({
        id: device.deviceId,
        label: device.label || `Unknown ${device.kind}`,
        kind: device.kind.replace('audio', '') as 'input' | 'output',
        isDefault: device.deviceId === 'default',
        isActive: false,
      }));
  } catch (error) {
    throw new AudioError('Failed to enumerate audio devices', error);
  }
}

// Calculate volume level from audio stream
export function calculateVolume(stream: MediaStream): number {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);
  
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += Math.abs(dataArray[i] - 128);
  }
  
  return Math.min(Math.max(sum / bufferLength / 128, 0), 1);
}

// Custom error class for audio operations
export class AudioError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'AudioError';
    Object.setPrototypeOf(this, AudioError.prototype);
  }
}

// Helper to stop all tracks in a stream
export function stopStream(stream?: MediaStream) {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}