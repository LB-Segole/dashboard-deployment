import { useState, useEffect } from 'react';
import { CallDetails } from '@/types/calls';
import { fetchCallDetails } from '@/services/callsService';

export const useCallDetails = (callId: string) => {
  const [call, setCall] = useState<CallDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCallDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCallDetails(callId);
        setCall(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load call details');
      } finally {
        setLoading(false);
      }
    };

    if (callId) {
      loadCallDetails();
    }
  }, [callId]);

  return { call, loading, error };
}; 