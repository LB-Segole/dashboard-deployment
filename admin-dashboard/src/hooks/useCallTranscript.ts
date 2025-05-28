import { useState, useEffect } from 'react';

interface TranscriptLine {
  speaker: string;
  text: string;
}

export const useCallTranscript = () => {
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranscript = async (callId: string) => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      const mockTranscript: TranscriptLine[] = [
        { speaker: 'Agent', text: 'Hello, how can I help you today?' },
        { speaker: 'Customer', text: 'Hi, I have a question about my account.' },
        { speaker: 'Agent', text: 'Of course, I\'d be happy to help. Could you please provide your account number?' },
        { speaker: 'Customer', text: 'Yes, it\'s 12345.' },
      ];

      setTranscript(mockTranscript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcript');
    } finally {
      setLoading(false);
    }
  };

  return {
    transcript,
    loading,
    error,
    fetchTranscript,
  };
}; 