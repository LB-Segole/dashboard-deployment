import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Check } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';

export function AudioRecorder({ onRecordingComplete }: { onRecordingComplete: (blob: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(audioBlob);
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      audioChunksRef.current = [];
      
      // Start timer
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please enable microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSave = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob);
      setRecordedBlob(null);
      setTimer(0);
    }
  };

  const handleDelete = () => {
    setRecordedBlob(null);
    setTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        {!recordedBlob ? (
          <>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-full ${isRecording ? 'bg-red-600' : 'bg-blue-600'} text-white hover:opacity-90 transition-opacity`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <Square size={20} /> : <Mic size={20} />}
            </button>
            
            <div className="text-gray-700 font-medium">
              {isRecording ? formatTime(timer) : 'Press to record'}
            </div>
            
            <div className="w-10"></div> {/* Spacer */}
          </>
        ) : (
          <>
            <button
              onClick={handleDelete}
              className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              aria-label="Delete recording"
            >
              <Trash2 size={20} />
            </button>
            
            <div className="text-gray-700 font-medium">
              Recorded: {formatTime(timer)}
            </div>
            
            <button
              onClick={handleSave}
              className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
              aria-label="Save recording"
            >
              <Check size={20} />
            </button>
          </>
        )}
      </div>
      
      {recordedBlob && (
        <div className="mt-4">
          <AudioPlayer audioUrl={URL.createObjectURL(recordedBlob)} />
        </div>
      )}
    </div>
  );
}