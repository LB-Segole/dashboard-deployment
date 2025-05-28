import { AdminUser } from '@/types/admin';
import { API_BASE_URL } from '@/config/constants';

interface AuthResponse {
  token: string;
  user: AdminUser;
}

export async function loginAdmin(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutAdmin(token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

export async function refreshToken(refreshToken: string) {
  return {
    user: { id: '1', name: 'Admin', email: 'admin@example.com' },
    token: 'token',
    refreshToken: 'refresh',
    expiresIn: 3600,
  };
}
