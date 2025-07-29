// GloHorizon API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5080/api',
  // Production: 'https://your-domain.com/api'
}

export const REQUEST_TIMEOUT = 30000 // 30 seconds

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'adminToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'adminUser'
}

export const API_ENDPOINTS = {
  // Authentication
  ADMIN_LOGIN: '/admin/login',
  ADMIN_CREATE: '/admin/create',

  // Bookings
  BOOKINGS_LIST: '/admin/bookings',
  BOOKING_DETAIL: '/admin/bookings',
  BOOKING_STATUS: '/admin/bookings',
  BOOKING_PRICING: '/admin/bookings',
  BOOKING_NOTES: '/admin/bookings',
  PAYMENT_LINK: '/admin/bookings',

  // Dashboard
  DASHBOARD: '/admin/dashboard',

  // Payments
  PAYMENT_VERIFY: '/payment/verify',

  // Images
  IMAGE_UPLOAD: '/image/upload',
  IMAGE_UPLOAD_MULTIPLE: '/image/upload-multiple'
}

// Types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  token: string
  user: AdminUser
}

export interface AdminUser {
  id: string
  fullName: string
  email: string
  phoneNumber: string
}

export interface BookingListItem {
  id: number
  referenceNumber: string
  serviceType: number
  status: number
  urgency: number
  createdAt: string
  estimatedPrice: number | null
  finalPrice: number | null
  currency: string
  user?: {
    fullName: string
    email: string
  }
}

export interface BookingDetail extends BookingListItem {
  updatedAt: string
  adminNotes: string
  user: {
    id: string
    fullName: string
    email: string
    phoneNumber: string
  }
  statusHistory: StatusHistoryItem[]
  bookingDetails: {
    departure?: string
    destination?: string
    departureDate?: string
    returnDate?: string
    passengers?: number
    classPreference?: string
    specialRequests?: string
  }
}

export interface StatusHistoryItem {
  fromStatus: number
  toStatus: number
  notes: string
  changedBy: string
  changedAt: string
}

export interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  completedBookings: number
  totalUsers: number
  recentBookings: BookingListItem[]
}

export interface StatusUpdateRequest {
  newStatus: number
  notes?: string
  adminNotes?: string
  estimatedPrice?: number
  finalPrice?: number
}

export interface PricingUpdateRequest {
  estimatedPrice: number
  finalPrice?: number
  currency: string
  notes?: string
}

export interface PaymentLinkResponse {
  success: boolean
  message: string
  paymentUrl: string
  reference: string
  amount: number
  currency: string
}