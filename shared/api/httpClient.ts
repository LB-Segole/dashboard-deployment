/**
 * VoiceAI HTTP Client
 * Axios-based wrapper with authentication, error handling, and retry logic
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { APIConfig, RETRY_ERROR_CODES, RATE_LIMIT_CONFIG } from './apiconfig';
import { APIEndpoints } from './endpoints';
import { getAuthToken, refreshAuthToken } from '../utils/auth';

export class HttpClient {
  private instance: AxiosInstance;
  private requestQueue: Array<() => void> = [];
  private requestsMade = 0;
  private lastResetTime = Date.now();

  constructor() {
    this.instance = axios.create({
      baseURL: APIConfig.BASE_URL,
      timeout: APIConfig.TIMEOUT,
      headers: APIConfig.DEFAULT_HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        // Rate limiting
        const now = Date.now();
        if (now - this.lastResetTime > RATE_LIMIT_CONFIG.PER_MS) {
          this.requestsMade = 0;
          this.lastResetTime = now;
        }

        if (this.requestsMade >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
          await new Promise<void>((resolve) => {
            this.requestQueue.push(() => {
              resolve();
            });
          });
        }

        this.requestsMade++;

        // Add auth token if available
        const token = getAuthToken();
        if (token && config.headers) {
          config.headers[APIConfig.AUTH_HEADER] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        
        // Handle token refresh
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshAuthToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers[APIConfig.AUTH_HEADER] = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        // Handle retry logic
        if (
          originalRequest &&
          error.response &&
          RETRY_ERROR_CODES.includes(error.response.status) &&
          (!originalRequest._retryCount || originalRequest._retryCount < APIConfig.RETRY_COUNT)
        ) {
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
          await new Promise((resolve) => setTimeout(resolve, APIConfig.RETRY_DELAY));
          return this.instance(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }
}

export const httpClient = new HttpClient();