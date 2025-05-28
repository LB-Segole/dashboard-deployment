/**
 * Auth Service
 * Handles authentication-related operations and token management
 */

import { APIEndpoints } from '../constants/apiendpoints';
import { httpClient } from './apiclient';
import { StorageService } from './storageservice';

export class AuthService {
  private storage: StorageService;

  constructor() {
    this.storage = new StorageService();
  }

  async login(email: string, password: string): Promise<any> {
    const response = await httpClient.post(APIEndpoints.AUTH.LOGIN, { email, password });
    this.setAuthToken(response.token);
    return response.user;
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(APIEndpoints.AUTH.LOGOUT);
    } finally {
      this.clearAuthToken();
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const response = await httpClient.get(APIEndpoints.AUTH.PROFILE);
      return response;
    } catch (error) {
      this.clearAuthToken();
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    const response = await httpClient.post(APIEndpoints.AUTH.REFRESH);
    this.setAuthToken(response.token);
    return response.token;
  }

  setAuthToken(token: string): void {
    this.storage.setItem('auth_token', token);
  }

  getAuthToken(): string | null {
    return this.storage.getItem('auth_token');
  }

  clearAuthToken(): void {
    this.storage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}