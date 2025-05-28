import { useState, useEffect, useCallback } from 'react';
import { useAudio } from '../contexts/AudioContext';

type DeepgramConfig = {
  apiKey: string;
  language?: string;
  punctuate?: boolean;
  interim_results?: boolean;
};

type Transcription = {
  isTranscribing: boolean;
  transcript: string;
  startTranscribing: () => Promise<void>;
  stopTranscribing: () => void;
  error: string | null;
};

export const useDeepgram = (config: DeepgramConfig): Transcription => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { startRecording, stopRecording } = useAudio();

  // In a real implementation, this would connect to Deepgram's API
  const startTranscribing = useCallback(async () => {
    try {
      setIsTranscribing(true);
      setError(null);
      setTranscript('');
      await startRecording();
      
      // Simulate receiving transcript chunks
      const phrases = [
        "Hello, how can I help you today?",
        "I'm interested in your AI voice services",
        "Great! Our platform offers 24/7 voice agents",
        "That sounds perfect for my business needs"
      ];
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < phrases.length) {
          setTranscript(prev => prev + (prev ? ' ' : '') + phrases[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    } catch (err) {
      setError('Failed to start transcription');
      setIsTranscribing(false);
      throw err;
    }
  }, [startRecording]);

  const stopTranscribing = useCallback(async () => {
    try {
      await stopRecording();
      setIsTranscribing(false);
    } catch (err) {
      setError('Failed to stop transcription');
      throw err;
    }
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      if (isTranscribing) {
        stopTranscribing().catch(console.error);
      }
    };
  }, [isTranscribing, stopTranscribing]);

  return {
    isTranscribing,
    transcript,
    startTranscribing,
    stopTranscribing,
    error,
  };
};