import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCallDetails } from '@/hooks/useCallDetails';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { TranscriptViewer, TranscriptSegment } from '@/components/audio/TranscriptViewer';
import { CallAnalytics } from '@/components/analytics/CallAnalytics';
import { Spinner } from '@/components/ui/Spinner';

const CallDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { call, loading, error } = useCallDetails(id!);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-gray-700">Call not found</p>
      </div>
    );
  }

  // Parse transcript string into TranscriptSegment array
  const parsedTranscript: TranscriptSegment[] = call.transcript
    ? JSON.parse(call.transcript)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Call Details</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Calls
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Call ID</h3>
              <p className="mt-1 text-sm text-gray-900">{call.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Duration</h3>
              <p className="mt-1 text-sm text-gray-900">{call.duration} seconds</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 text-sm text-gray-900">{call.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Agent</h3>
              <p className="mt-1 text-sm text-gray-900">{call.agentName}</p>
            </div>
          </div>

          <div className="space-y-6">
            {call.audioUrl && (
              <div>
                <h3 className="text-lg font-medium mb-4">Audio Recording</h3>
                <AudioPlayer audioUrl={call.audioUrl} />
              </div>
            )}

            {parsedTranscript.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Transcript</h3>
                <TranscriptViewer transcript={parsedTranscript} callId={call.id} />
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-4">Analytics</h3>
              <CallAnalytics callId={call.id} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CallDetails;