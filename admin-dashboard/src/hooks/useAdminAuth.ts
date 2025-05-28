import { useState, useEffect } from 'react';
import { AdminUser } from '@/types/admin';
import { loginAdmin, logoutAdmin, verifyAdminToken } from '@/services/authService';

export const useAdminAuth = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setAdmin(null);
        return false;
      }
      const isValid = await verifyAdminToken(token);
      if (!isValid) {
        setAdmin(null);
        localStorage.removeItem('adminToken');
        return false;
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { token, user } = await loginAdmin(email, password);
      localStorage.setItem('adminToken', token);
      setAdmin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (token) {
        await logoutAdmin(token);
        localStorage.removeItem('adminToken');
      }
      setAdmin(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    admin,
    loading,
    error,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!admin,
  };
};