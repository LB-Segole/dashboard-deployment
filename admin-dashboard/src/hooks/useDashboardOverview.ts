import { useState } from 'react';

export function useDashboardOverview() {
  const [data] = useState({});
  const [loading] = useState(false);
  const [error] = useState(null);
  const refresh = () => {};
  return { data, loading, error, refresh };
} 