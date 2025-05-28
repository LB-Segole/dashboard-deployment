import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Circle, Disc3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '../../utils/cn';

export function VoiceRecorder({ 
  onRecordingComplete,
  autoStart = false
}: {
  onRecordingComplete: (blob: Blob) => void;
  autoStart?: boolean;
}) {
  const [isRecording, setIsRecording] = useState(autoStart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoStart) {
      startRecording();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [autoStart]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setIsProcessing(true);
        setTimeout(() => {
          onRecordingComplete(audioBlob);
          setIsProcessing(false);
        }, 500);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      audioChunksRef.current = [];
      setElapsedTime(0);

      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording failed:', err);
      alert('Microphone access is required for voice recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-full',
            isRecording ? 'bg-red-500/20 animate-pulse' : 'bg-slate-700'
          )}>
            {isProcessing ? (
              <Disc3 className="h-5 w-5 text-blue-500 animate-spin" />
            ) : isRecording ? (
              <Square className="h-5 w-5 text-red-500" />
            ) : (
              <Mic className="h-5 w-5 text-blue-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">
              {isProcessing ? 'Processing...' : isRecording ? 'Recording' : 'Ready to record'}
            </p>
            <p className="text-xs text-slate-400">
              {formatTime(elapsedTime)}
            </p>
          </div>
        </div>
        
        {isRecording ? (
          <Button variant="destructive" onClick={stopRecording}>
            Stop
          </Button>
        ) : (
          <Button onClick={startRecording} disabled={isProcessing}>
            Start Recording
          </Button>
        )}
      </div>
    </div>
  );
}