import { useState, useEffect } from 'react';
import { fetchAdminDashboardData } from '@/services/adminService';
import { AdminDashboardData } from '@/types/adminTypes';

export const useAdminData = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAdminDashboardData();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return { data, loading, error, refreshData };
};