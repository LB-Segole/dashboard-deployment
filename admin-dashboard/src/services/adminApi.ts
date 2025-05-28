// services/adminAPI.ts
import axios from 'axios';
import { AdminUser, SystemSettings } from '@/types/admin';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '/api/v1';

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('voiceai_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AdminService = {
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const response = await adminApi.post('/admin/login', { email, password });
    return response.data;
  },

  async getSystemSettings(): Promise<SystemSettings> {
    const response = await adminApi.get('/admin/settings');
    return response.data;
  },

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await adminApi.put('/admin/settings', settings);
    return response.data;
  },

  async getAdminUsers(): Promise<AdminUser[]> {
    const response = await adminApi.get('/admin/users');
    return response.data;
  },

  async createAdminUser(user: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> {
    const response = await adminApi.post('/admin/users', user);
    return response.data;
  },

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    const response = await adminApi.put(`/admin/users/${id}`, updates);
    return response.data;
  },

  async deleteAdminUser(id: string): Promise<void> {
    await adminApi.delete(`/admin/users/${id}`);
  },
};

export default adminApi;