import { useParams } from 'react-router-dom';
import { Phone, User, Clock, Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useCalls } from '../hooks/useCalls';

export const CallDetails = () => {
  const { callId } = useParams<{ callId: string }>();
  const { callHistory } = useCalls();
  const [isLoading, setIsLoading] = useState(true);
  const [call, setCall] = useState<Call | null>(null);

  useEffect(() => {
    const fetchCallDetails = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundCall = callHistory.find(c => c.id === callId) || null;
        setCall(foundCall);
      } catch (error) {
        console.error('Failed to fetch call details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCallDetails();
  }, [callId, callHistory]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!call) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Not Found</h2>
          <p className="text-gray-600">The requested call could not be found in your history.</p>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="mt-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Calls
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Calls
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Call Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="font-medium text-gray-900 capitalize">{call.status}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{formatDuration(call.duration)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(call.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">To</p>
                  <p className="font-medium text-gray-900">{call.to}</p>
                </div>
              </div>
            </div>
          </Card>

          {call.transcript && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transcript</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line text-gray-700">{call.transcript}</p>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Recording</h3>
            {call.recordingUrl ? (
              <div className="flex flex-col items-center">
                <audio controls className="w-full">
                  <source src={call.recordingUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                <Button variant="outline" className="mt-4 w-full">
                  Download Recording
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No recording available for this call
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Start Time</p>
                <p className="text-gray-900">{formatTime(call.timestamp)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">End Time</p>
                <p className="text-gray-900">
                  {formatTime(new Date(call.timestamp.getTime() + call.duration * 1000))}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Call Type</p>
                <p className="text-gray-900">Outbound</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};