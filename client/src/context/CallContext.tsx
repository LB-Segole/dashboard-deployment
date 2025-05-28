import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAudio } from './AudioContext';

type CallStatus = 'idle' | 'calling' | 'ringing' | 'in-progress' | 'ended';

type Call = {
  id: string;
  from: string;
  to: string;
  status: CallStatus;
  duration: number;
  timestamp: Date;
  recordingUrl?: string;
  transcript?: string;
};

type CallContextType = {
  currentCall: Call | null;
  callHistory: Call[];
  startCall: (to: string) => Promise<void>;
  endCall: () => void;
  answerCall: (callId: string) => void;
  rejectCall: (callId: string) => void;
  toggleMute: () => void;
  toggleHold: () => void;
  sendDTMF: (tone: string) => void;
  isLoading: boolean;
  error: string | null;
};

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [callHistory, setCallHistory] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnHold, setIsOnHold] = useState(false);
  const { state: audioState, toggleMute: toggleAudioMute } = useAudio();

  // Simulate incoming calls for demo purposes
  useEffect(() => {
    if (currentCall?.status === 'ringing') {
      const timer = setTimeout(() => {
        if (currentCall?.status === 'ringing') {
          endCall();
        }
      }, 30000); // Auto-reject after 30 seconds

      return () => clearTimeout(timer);
    }
  }, [currentCall]);

  const startCall = async (to: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCall: Call = {
        id: `call-${Date.now()}`,
        from: 'user-123',
        to,
        status: 'calling',
        duration: 0,
        timestamp: new Date(),
      };
      
      setCurrentCall(newCall);
      
      // Simulate call being answered after 2 seconds
      setTimeout(() => {
        if (currentCall?.id === newCall.id) {
          setCurrentCall(prev => prev ? {
            ...prev,
            status: 'in-progress',
          } : null);
          
          // Start call duration timer
          const interval = setInterval(() => {
            setCurrentCall(prev => prev ? {
              ...prev,
              duration: prev.duration + 1,
            } : null);
          }, 1000);
          
          return () => clearInterval(interval);
        }
      }, 2000);
    } catch (err) {
      setError('Failed to initiate call');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const endCall = () => {
    if (currentCall) {
      setCallHistory(prev => [
        {
          ...currentCall,
          status: 'ended',
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }
    setCurrentCall(null);
  };

  const answerCall = (callId: string) => {
    setCurrentCall(prev => prev?.id === callId ? {
      ...prev,
      status: 'in-progress',
    } : prev);
  };

  const rejectCall = (callId: string) => {
    if (currentCall?.id === callId) {
      setCallHistory(prev => [
        {
          ...currentCall,
          status: 'ended',
          duration: 0,
          timestamp: new Date(),
        },
        ...prev,
      ]);
      setCurrentCall(null);
    }
  };

  const toggleMute = () => {
    toggleAudioMute();
  };

  const toggleHold = () => {
    setIsOnHold(prev => !prev);
  };

  const sendDTMF = (tone: string) => {
    // In a real implementation, this would send DTMF tones
    console.log('DTMF tone sent:', tone);
  };

  return (
    <CallContext.Provider
      value={{
        currentCall,
        callHistory,
        startCall,
        endCall,
        answerCall,
        rejectCall,
        toggleMute,
        toggleHold,
        sendDTMF,
        isLoading,
        error,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCalls = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCalls must be used within a CallProvider');
  }
  return context;
};