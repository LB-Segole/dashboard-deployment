import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface AdminState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
  preferences: AdminPreferences;
  systemStatus: SystemStatus;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  avatar?: string;
  lastLoginAt: string;
  createdAt: string;
}

interface AdminPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    refreshInterval: number;
    defaultView: string;
  };
}

interface SystemStatus {
  isOnline: boolean;
  lastUpdated: string;
  services: {
    database: 'online' | 'offline' | 'degraded';
    deepgram: 'online' | 'offline' | 'degraded';
    openai: 'online' | 'offline' | 'degraded';
    signalwire: 'online' | 'offline' | 'degraded';
  };
}

type AdminAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AdminUser | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_PERMISSIONS'; payload: string[] }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<AdminPreferences> }
  | { type: 'UPDATE_SYSTEM_STATUS'; payload: Partial<SystemStatus> }
  | { type: 'LOGOUT' };

const initialState: AdminState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  permissions: [],
  preferences: {
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    dashboard: {
      refreshInterval: 30000,
      defaultView: 'overview',
    },
  },
  systemStatus: {
    isOnline: true,
    lastUpdated: new Date().toISOString(),
    services: {
      database: 'online',
      deepgram: 'online',
      openai: 'online',
      signalwire: 'online',
    },
  },
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.payload };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    
    case 'UPDATE_SYSTEM_STATUS':
      return {
        ...state,
        systemStatus: { ...state.systemStatus, ...action.payload },
      };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
        preferences: state.preferences, // Keep preferences
      };
    
    default:
      return state;
  }
}

interface AdminContextType {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<AdminPreferences>) => void;
  checkPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  refreshSystemStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Load initial data
  useEffect(() => {
    initializeAdmin();
  }, []);

  const initializeAdmin = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Check for existing session
      const token = localStorage.getItem('admin_token');
      if (token) {
        // Validate token and get user data
        const user = await validateToken(token);
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          
          // Load permissions
          const permissions = await getUserPermissions(user.id);
          dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
        }
      }
      
      // Load preferences from localStorage
      const savedPreferences = localStorage.getItem('admin_preferences');
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      }
      
      // Check system status
      await refreshSystemStatus();
      
    } catch (error) {
      console.error('Failed to initialize admin:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const { user, token, permissions } = await response.json();
      
      // Store token
      localStorage.setItem('admin_token', token);
      
      // Update state
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    dispatch({ type: 'LOGOUT' });
  };

  const updatePreferences = (preferences: Partial<AdminPreferences>) => {
    const updatedPreferences = { ...state.preferences, ...preferences };
    localStorage.setItem('admin_preferences', JSON.stringify(updatedPreferences));
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  };

  const checkPermission = (permission: string): boolean => {
    return state.permissions.includes(permission) || state.user?.role === 'super_admin';
  };

  const hasRole = (role: string): boolean => {
    if (!state.user) return false;
    
    const roleHierarchy: Record<string, number> = {
      moderator: 1,
      admin: 2,
      super_admin: 3,
    };
    
    const userLevel = roleHierarchy[state.user.role] || 0;
    const requiredLevel = roleHierarchy[role] || 0;
    
    return userLevel >= requiredLevel;
  };

  const refreshSystemStatus = async (): Promise<void> => {
    try {
      const response = await fetch('/api/admin/system/status');
      if (response.ok) {
        const status = await response.json();
        dispatch({ 
          type: 'UPDATE_SYSTEM_STATUS', 
          payload: { ...status, lastUpdated: new Date().toISOString() }
        });
      }
    } catch (error) {
      console.error('Failed to refresh system status:', error);
      dispatch({ 
        type: 'UPDATE_SYSTEM_STATUS', 
        payload: { isOnline: false, lastUpdated: new Date().toISOString() }
      });
    }
  };

  const value: AdminContextType = {
    state,
    dispatch,
    login,
    logout,
    updatePreferences,
    checkPermission,
    hasRole,
    refreshSystemStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Helper functions
async function validateToken(token: string): Promise<AdminUser | null> {
  try {
    const response = await fetch('/api/admin/validate', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/admin/users/${userId}/permissions`);
    if (response.ok) {
      const { permissions } = await response.json();
      return permissions;
    }
    return [];
  } catch {
    return [];
  }
}

export default AdminContext;