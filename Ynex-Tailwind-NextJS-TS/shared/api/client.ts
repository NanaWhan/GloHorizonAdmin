// GloHorizon API Client

import { API_CONFIG, REQUEST_TIMEOUT, TOKEN_KEYS, ApiResponse } from './config';

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = REQUEST_TIMEOUT;
  }

  // Get stored access token
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    }
    return null;
  }

  // Set access token
  public setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
    }
  }

  // Remove tokens (logout)
  public removeTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.USER_DATA);
    }
  }

  // Build headers with authentication
  private buildHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    const token = this.getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Make HTTP request
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(customHeaders);

    const config: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.timeout)
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      // Handle different response types
      let responseData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        // Handle HTTP errors
        throw new Error(responseData?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        message: responseData?.message || 'Success',
        data: responseData
      };

    } catch (error: any) {
      console.error(`API Error [${method} ${endpoint}]:`, error);

      // Handle different error types
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }

      if (error.message?.includes('Failed to fetch')) {
        throw new Error('Network error - please check your connection');
      }

      throw error;
    }
  }

  // HTTP Methods
  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, headers);
  }

  public async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, headers);
  }

  public async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, headers);
  }

  public async patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, headers);
  }

  public async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }

  // Upload file
  public async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const token = this.getAccessToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        signal: AbortSignal.timeout(this.timeout)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        message: responseData?.message || 'Upload successful',
        data: responseData
      };

    } catch (error: any) {
      console.error(`Upload Error [${endpoint}]:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;