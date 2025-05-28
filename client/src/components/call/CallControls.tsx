import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, MessageSquare, Settings, UserPlus } from 'lucide-react';

type CallControlsProps = {
  isActive: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onVolumeChange: (volume: number) => void;
  onInviteParticipant: () => void;
  onToggleChat: () => void;
  onSettings: () => void;
};

export function CallControls({
  isActive,
  isMuted,
  isVideoOn,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onVolumeChange,
  onInviteParticipant,
  onToggleChat,
  onSettings
}: CallControlsProps) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 shadow-lg">
      <div className="flex justify-center gap-4">
        {/* Microphone Control */}
        <button
          onClick={onToggleMute}
          className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-blue-600'} text-white hover:opacity-90 transition-all`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Video Control */}
        <button
          onClick={onToggleVideo}
          className={`p-3 rounded-full ${isVideoOn ? 'bg-blue-600' : 'bg-gray-600'} text-white hover:opacity-90 transition-all`}
          aria-label={isVideoOn ? 'Turn off video' : 'Turn on video'}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Volume2 className="text-gray-300" size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.7"
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* End Call */}
        <button
          onClick={onEndCall}
          className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
          aria-label="End call"
        >
          <PhoneOff size={20} />
        </button>

        {/* Secondary Controls */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onToggleChat}
            className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
            aria-label="Toggle chat"
          >
            <MessageSquare size={18} />
          </button>
          <button
            onClick={onInviteParticipant}
            className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
            aria-label="Invite participant"
          >
            <UserPlus size={18} />
          </button>
          <button
            onClick={onSettings}
            className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}