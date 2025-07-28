// GloHorizon API Configuration

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile'
    },
    
    // Booking endpoints
    BOOKINGS: {
      LIST: '/bookings',
      DETAILS: '/bookings/:id',
      CREATE: '/bookings',
      UPDATE: '/bookings/:id',
      DELETE: '/bookings/:id',
      STATUS_UPDATE: '/bookings/:id/status'
    },
    
    // Dashboard endpoints
    DASHBOARD: {
      OVERVIEW: '/dashboard/overview',
      STATS: '/dashboard/stats',
      RECENT_BOOKINGS: '/dashboard/recent-bookings'
    },
    
    // Payment endpoints
    PAYMENTS: {
      LIST: '/payments',
      VERIFY: '/payments/:id/verify',
      WEBHOOK: '/payments/webhook',
      MANUAL_VERIFY: '/payments/:id/manual-verify'
    },
    
    // Admin endpoints
    ADMIN: {
      NOTIFICATIONS: '/admin/notifications',
      SETTINGS: '/admin/settings',
      USERS: '/admin/users'
    }
  }
};

// Request timeout configuration
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication token storage keys
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'glohorizon_access_token',
  REFRESH_TOKEN: 'glohorizon_refresh_token',
  USER_DATA: 'glohorizon_user_data'
};