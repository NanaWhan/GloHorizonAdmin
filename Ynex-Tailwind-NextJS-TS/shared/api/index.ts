// GloHorizon API - Main Export

import { apiClient } from './client'
import { AuthService } from './services/auth'
import { BookingService } from './services/bookings'
import { DashboardService } from './services/dashboard'

// Export API client instance
export { apiClient }

// Export all services
export {
  AuthService,
  BookingService,
  DashboardService
}

// Export types
export * from './config'
export * from '../types/glohorizon'

// Initialize API client on module load
console.log('🌍 GloHorizon Travel API initialized')