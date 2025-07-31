import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getApiBaseUrl } from '../config/api';
import { supabase } from '../config/supabase';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: getApiBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidHd6ZmJ0ZmVrbWd2c3dsZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTcyODMsImV4cCI6MjA2NzkzMzI4M30.wLGaW0ZucC22cUJiFHrBgmXLCZuVmAg5SjZvb20Rf64',
      },
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          // Get Supabase session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
          }
          
          // Debug logging
          console.log('API Request:', {
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            method: config.method,
            headers: config.headers
          });
        } catch (error) {
          console.warn('Failed to get auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          await supabase.auth.signOut();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    // Check if this is a Supabase edge function call
    const edgeFunctions = [
      'interest-discovery',
      'thread-discovery',
      'thread-generation',
      'content-assembly',
      'exercise-generation',
      'progress-tracking'
    ];
    
    const functionName = url.replace('/', '');
    if (edgeFunctions.includes(functionName)) {
      // Use Supabase edge function invocation
      const { data: result, error } = await supabase.functions.invoke(functionName, {
        body: data
      });
      
      if (error) {
        throw error;
      }
      
      return result as T;
    }
    
    // Regular HTTP POST
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }
}

export const api = new ApiService();
export default api;