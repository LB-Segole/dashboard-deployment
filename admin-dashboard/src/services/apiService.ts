// services/apiService.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useToast } from '@/components/ui/Use-toast';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '/api/v1';

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('voiceai_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { addToast } = useToast();
        
        if (error.response) {
          const { status, data } = error.response;
          
          if (status === 401) {
            addToast('Session Expired: Please log in again', 'error');
            // Redirect to login
          } else if (status === 403) {
            addToast('Permission Denied: You do not have access to this resource', 'error');
          } else if (status >= 500) {
            addToast('Server Error: Please try again later', 'error');
          } else {
            addToast(`Request Failed: ${data.message || 'An error occurred'}`, 'error');
          }
        } else {
          addToast('Network Error: Please check your connection', 'error');
        }

        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  public async upload<T>(url: string, file: File, fieldName = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();