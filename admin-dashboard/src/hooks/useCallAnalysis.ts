import { useState } from 'react';

export function useCallAnalysis() {
  const [analysis] = useState({});
  const [loading] = useState(false);
  const [error] = useState(null);
  return { analysis, loading, error };
} 