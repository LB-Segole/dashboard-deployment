import { useState, useRef, useEffect } from 'react';
import { CallControls } from './CallControls';
import { CallStatus } from './CallStatus';
import { TranscriptDisplay } from './TranscriptDisplay';

type Participant = {
  id: string;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isSpeaking: boolean;
};

type TranscriptLine = {
  speaker: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
};

export function CallInterface() {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', isMuted: false, isSpeaking: true },
    { id: '2', name: 'Customer', isMuted: false, isSpeaking: false }
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate call connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus('active');
      setTranscript([
        {
          speaker: 'AI',
          text: 'Hello! How can I help you today?',
          timestamp: new Date(),
          isAI: true,
        },
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    setParticipants(prev =>
      prev.map(p => (p.id === '1' ? { ...p, isMuted: !isMuted } : p))
    );
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    // Add call to history
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <div className="bg-slate-900 text-gray-100 min-h-screen">
      {/* Main Call Area */}
      <div className="container mx-auto px-4 py-8">
        <CallStatus status={callStatus} duration={callStatus === 'active' ? 120 : 0} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Video/Profile Area */}
          <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participants.map(participant => (
                <div 
                  key={participant.id} 
                  className={`relative bg-slate-700 rounded-xl p-4 ${participant.isSpeaking ? 'ring-2 ring-blue-500' : ''}`}
                >
                  {participant.avatar ? (
                    <img 
                      src={participant.avatar} 
                      alt={participant.name}
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-slate-600 rounded-lg">
                      <span className="text-4xl text-gray-300">
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {participant.name} {participant.isMuted && '(Muted)'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript Panel */}
          <div className="bg-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Live Transcript</h3>
            <TranscriptDisplay lines={transcript} />
          </div>
        </div>

        {/* Controls */}
        <div className="fixed bottom-8 left-0 right-0 px-4">
          <CallControls
            isActive={callStatus === 'active'}
            isMuted={isMuted}
            isVideoOn={isVideoOn}
            onToggleMute={handleToggleMute}
            onToggleVideo={() => setIsVideoOn(!isVideoOn)}
            onEndCall={handleEndCall}
            onVolumeChange={(vol) => console.log('Volume:', vol)}
            onInviteParticipant={() => alert('Invite participant')}
            onToggleChat={() => alert('Toggle chat')}
            onSettings={() => alert('Settings')}
          />
        </div>
      </div>
    </div>
  );
}