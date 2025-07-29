// GloHorizon Authentication Service

import { apiClient } from '../client'
import { LoginRequest, LoginResponse, AdminUser } from '../config'

export class AuthService {

  // Admin login
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/admin/login', credentials)

    if (response.data?.success && response.data.token) {
      // Store auth data
      apiClient.setAccessToken(response.data.token)

      if (typeof window !== 'undefined') {
        localStorage.setItem('adminUser', JSON.stringify(response.data.user))
      }

      return response.data
    }

    throw new Error(response.data?.message || 'Login failed')
  }

  // Get current admin user
  static getCurrentUser(): AdminUser | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('adminUser')
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!apiClient.getAccessToken()
  }

  // Logout
  static logout(): void {
    apiClient.removeTokens()

    if (typeof window !== 'undefined') {
      // Redirect to login page
      window.location.href = '/admin/login'
    }
  }

  // Validate token (check if still valid)
  static async validateToken(): Promise<boolean> {
    try {
      // Try to make an authenticated request
      const response = await apiClient.get('/admin/dashboard')
      return response.success
    } catch (error) {
      return false
    }
  }

  // Create new admin account (for initial setup)
  static async createAdmin(data: {
    fullName: string
    email: string
    password: string
    phoneNumber: string
  }): Promise<void> {
    await apiClient.post('/admin/create', data)
  }
}