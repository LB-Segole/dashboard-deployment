/**
 * Auth Context
 * Manages authentication state and provides auth-related functions
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { httpClient } from '../services/apiclient';
import { AuthService } from '../services/authservice';
import { APIEndpoints } from '../constants/apiendpoints';
import { Roles } from '../constants/roles';
import { ErrorCodes } from '../constants/errorcodes';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  role: string;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authService = new AuthService();

  const isAuthenticated = !!user;
  const role = user?.role || Roles.GUEST;

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [authService]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.post(APIEndpoints.AUTH.LOGIN, { email, password });
      authService.setAuthToken(response.token);
      await loadUser();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await httpClient.post(APIEndpoints.AUTH.LOGOUT);
      authService.clearAuthToken();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await httpClient.post(APIEndpoints.AUTH.REFRESH);
      authService.setAuthToken(response.token);
      return response.token;
    } catch (err) {
      await logout();
      throw err;
    }
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === Roles.SUPER_ADMIN) return true;
    return user.permissions?.includes(permission);
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        role,
        loading,
        error,
        login,
        logout,
        refreshToken,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};