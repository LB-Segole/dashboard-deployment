// services/userService.ts
import { apiService } from './apiService';
import { User, UserRole, UserListResponse, UserCreatePayload, UserUpdatePayload } from '@/types/admin';
import { API_BASE_URL } from '@/config/constants';

export const UserService = {
  async getUsers(
    page: number = 1,
    limit: number = 20,
    role?: UserRole
  ): Promise<{ users: User[]; total: number }> {
    const response = await apiService.get<{ data: User[]; total: number }>('/users', {
      params: { page, limit, role },
    });
    return { users: response.data, total: response.total };
  },

  async getUser(userId: string): Promise<User> {
    return await apiService.get<User>(`/users/${userId}`);
  },

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return await apiService.post<User>('/users', user);
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return await apiService.put<User>(`/users/${userId}`, updates);
  },

  async deleteUser(userId: string): Promise<void> {
    await apiService.delete(`/users/${userId}`);
  },

  async resetPassword(userId: string): Promise<{ tempPassword: string }> {
    return await apiService.post<{ tempPassword: string }>(`/users/${userId}/reset-password`);
  },

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    return await apiService.put<User>(`/users/${userId}/role`, { role });
  },

  async getActiveSessions(userId: string): Promise<Array<{ id: string; ip: string; lastActive: string }>> {
    return await apiService.get<Array<{ id: string; ip: string; lastActive: string }>>(
      `/users/${userId}/sessions`
    );
  },

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await apiService.delete(`/users/${userId}/sessions/${sessionId}`);
  },
};

export type { User, UserRole, UserListResponse, UserCreatePayload, UserUpdatePayload } from '@/types/admin';

// Add these functions for compatibility with hooks
export async function listUsers(page = 1, limit = 20, search = ""): Promise<UserListResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getUser(id: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function createUser(data: UserCreatePayload): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}