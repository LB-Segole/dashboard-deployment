import { useState, useEffect } from 'react';
import { CallAnalysis } from '@/types/callAnalytics';

export function useCallAnalysis() {
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (callId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      const response = await fetch(`/api/calls/${callId}/analysis`);
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch call analysis');
    } finally {
      setLoading(false);
    }
  };

  return {
    analysis,
    loading,
    error,
    fetchAnalysis
  };
} 