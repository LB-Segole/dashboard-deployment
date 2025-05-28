/**
 * API Client Service
 * Wrapper around HTTP client with additional functionality
 */

import { HttpClient } from '../api/httpclient';
import { APIEndpoints } from '../constants/apiendpoints';
import { ErrorCodes } from '../constants/errorcodes';
import { AuthService } from './authservice';

export class ApiClient {
  private httpClient: HttpClient;
  private authService: AuthService;

  constructor() {
    this.httpClient = new HttpClient();
    this.authService = new AuthService();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, params);
      return await this.httpClient.get<T>(url);
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      return await this.httpClient.post<T>(endpoint, data);
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      return await this.httpClient.put<T>(endpoint, data);
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      return await this.httpClient.delete<T>(endpoint);
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }
    return url;
  }

  private handleError(error: any) {
    if (error.response?.status === 401) {
      this.authService.clearAuthToken();
      // Redirect to login or refresh token
    }
    // Additional error handling logic
  }
}

export const apiClient = new ApiClient();