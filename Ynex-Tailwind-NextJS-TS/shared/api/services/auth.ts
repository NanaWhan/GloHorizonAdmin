// GloHorizon Authentication Service

import { apiClient } from '../client';
import { API_CONFIG, TOKEN_KEYS } from '../config';
import { User, LoginRequest, LoginResponse } from '../types';

class AuthService {
  
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        // Store tokens and user data
        this.storeAuthData(response.data);
        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      );

      if (response.success && response.data) {
        this.storeAuthData(response.data);
        return response.data;
      }

      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>(
        API_CONFIG.ENDPOINTS.AUTH.PROFILE
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch profile');
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ accessToken: string }>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      if (response.success && response.data) {
        apiClient.setAccessToken(response.data.accessToken);
        return response.data.accessToken;
      }

      throw new Error(response.message || 'Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout(); // Force logout on refresh failure
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage regardless of API call success
      this.clearAuthData();
    }
  }

  // Store authentication data in local storage
  private storeAuthData(authData: LoginResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, authData.accessToken);
      localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, authData.refreshToken);
      localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(authData.user));
      
      // Set token in API client
      apiClient.setAccessToken(authData.accessToken);
    }
  }

  // Clear authentication data
  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.USER_DATA);
    }
    apiClient.removeTokens();
  }

  // Get stored refresh token
  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
      return !!token;
    }
    return false;
  }

  // Get stored user data
  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(TOKEN_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Check if user has admin role
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;