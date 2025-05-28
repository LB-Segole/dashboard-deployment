import { useState, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, User, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';

type CallStatus = 'idle' | 'calling' | 'connected' | 'ended';

export const CallForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const callDurationRef = useRef<number>(0);

  const handleCall = async () => {
    if (!phoneNumber) {
      setError('Please enter a valid phone number');
      return;
    }

    setError(null);
    setIsLoading(true);
    setCallStatus('calling');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCallStatus('connected');
      callDurationRef.current = 0;
      const interval = setInterval(() => {
        callDurationRef.current += 1;
      }, 1000);
    } catch (err) {
      setError('Failed to initiate call');
      setCallStatus('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => setCallStatus('idle'), 2000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className="max-w-md mx-auto p-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Start a Call</h3>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={callStatus !== 'idle'}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {callStatus === 'connected' && (
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span className="text-gray-900">{phoneNumber}</span>
            </div>
            <span className="text-gray-600">
              {formatDuration(callDurationRef.current)}
            </span>
          </div>
        )}

        <div className="flex justify-center space-x-4 pt-4">
          {callStatus === 'idle' ? (
            <Button
              onClick={handleCall}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Start Call
                </>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant={isMuted ? 'destructive' : 'outline'}
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleEndCall}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                End Call
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};