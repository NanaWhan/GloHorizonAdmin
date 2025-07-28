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
  private getAccessToken(): string | null {
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

  // Build full URL with parameters
  private buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    let url = `${this.baseURL}${endpoint}`;
    
    // Replace path parameters (e.g., :id)
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });

    return url;
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    options: {
      data?: any;
      params?: Record<string, string>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { data, params = {}, headers = {} } = options;
    
    try {
      const url = this.buildUrl(endpoint, params);
      const requestHeaders = this.buildHeaders(headers);

      const config: RequestInit = {
        method,
        headers: requestHeaders,
        signal: AbortSignal.timeout(this.timeout)
      };

      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error(`API ${method} ${endpoint} error:`, error);
      throw error;
    }
  }

  // HTTP Methods
  public get<T>(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, { params, headers });
  }

  public post<T>(endpoint: string, data?: any, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, { data, params, headers });
  }

  public put<T>(endpoint: string, data?: any, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, { data, params, headers });
  }

  public patch<T>(endpoint: string, data?: any, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, { data, params, headers });
  }

  public delete<T>(endpoint: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, { params, headers });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;