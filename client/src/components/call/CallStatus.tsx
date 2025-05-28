import { Phone, Clock } from 'lucide-react';

type CallStatusProps = {
  status: 'connecting' | 'active' | 'ended';
  duration: number; // in seconds
};

export function CallStatus({ status, duration }: CallStatusProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center justify-between bg-blue-600/20 text-blue-100 border border-blue-500 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2">
        <Phone size={18} />
        <span className="font-medium">
          {status === 'connecting' && 'Connecting...'}
          {status === 'active' && 'Call in progress'}
          {status === 'ended' && 'Call ended'}
        </span>
      </div>
      
      {status === 'active' && (
        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span className="font-mono">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}