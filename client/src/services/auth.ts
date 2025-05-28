import { api } from './api';

export const authService = {
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },

  register: async (name: string, email: string, password: string) => {
    return api.post('/auth/register', { name, email, password });
  },

  logout: async (token: string) => {
    return api.post('/auth/logout', {}, token);
  },

  refreshToken: async (refreshToken: string) => {
    return api.post('/auth/refresh', { refreshToken });
  },

  forgotPassword: async (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string) => {
    return api.post('/auth/reset-password', { token, password });
  },

  verifyEmail: async (token: string) => {
    return api.post('/auth/verify-email', { token });
  },

  getMe: async (token: string) => {
    return api.get('/auth/me', token);
  },

  updateProfile: async (data: any, token: string) => {
    return api.put('/auth/profile', data, token);
  },

  changePassword: async (oldPassword: string, newPassword: string, token: string) => {
    return api.put('/auth/change-password', { oldPassword, newPassword }, token);
  },
};