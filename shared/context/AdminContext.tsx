/**
 * Admin Context
 * Provides admin-specific functionality and data to the application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { httpClient } from '../services/apiclient';
import { APIEndpoints } from '../constants/apiendpoints';

interface AdminContextType {
  users: any[];
  metrics: any;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await httpClient.get(APIEndpoints.ADMIN.USERS);
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await httpClient.get(APIEndpoints.ADMIN.METRICS);
      setMetrics(data);
    } catch (err) {
      setError('Failed to fetch metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <AdminContext.Provider value={{ users, metrics, loading, error, fetchUsers, fetchMetrics }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};