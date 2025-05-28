import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCallTranscript } from '@/hooks/useCallTranscript';
import { parseCallTranscript } from '@/lib/utils';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const TranscriptAnalysis = () => {
  const { callId } = useParams();
  const { transcript, loading, error } = useCallTranscript(callId || '');
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('all');
  
  const parsedTranscript = transcript ? parseCallTranscript(transcript) : [];
  const speakers = Array.from(new Set(parsedTranscript.map((t) => t.speaker)));

  if (!callId) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center text-gray-800">
          <Icons.info className="h-5 w-5 mr-2" />
          <h3 className="font-medium">No call selected</h3>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Please select a call from the call history to view transcript
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center text-red-800">
          <Icons.alertCircle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Error loading transcript</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Call Transcript</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Icons.download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={currentSpeaker === 'all' ? 'default' : 'outline'}
          onClick={() => setCurrentSpeaker('all')}
        >
          All Speakers
        </Button>
        {speakers.map((speaker) => (
          <Button
            key={speaker}
            variant={currentSpeaker === speaker ? 'default' : 'outline'}
            onClick={() => setCurrentSpeaker(speaker)}
          >
            {speaker}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {parsedTranscript
          .filter(
            (line) => currentSpeaker === 'all' || line.speaker === currentSpeaker
          )
          .map((line, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                line.speaker.includes('Agent')
                  ? 'bg-blue-50 border border-blue-100'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Badge
                    variant={
                      line.speaker.includes('Agent') ? 'default' : 'outline'
                    }
                    className="mr-2"
                  >
                    {line.speaker}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {line.timestamp.toFixed(1)}s
                  </span>
                </div>
              </div>
              <p className="mt-2">{line.text}</p>
            </div>
          ))}
      </div>
    </div>
  );
};