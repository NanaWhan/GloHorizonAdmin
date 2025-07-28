// GloHorizon API Types

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  user?: User;
  
  // Travel details
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  serviceType: ServiceType;
  
  // Booking details
  status: BookingStatus;
  urgency: UrgencyLevel;
  totalAmount: number;
  currency: string;
  
  // Payment details
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentReference?: string;
  
  // Contact information
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Additional details
  specialRequests?: string;
  notes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Enums as per the GloHorizon specification
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  REFUNDED = 'refunded'
}

export enum ServiceType {
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  PACKAGE = 'package',
  VISA = 'visa',
  CAR_RENTAL = 'car_rental',
  TOUR = 'tour'
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

// Dashboard Types
export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
  bookingTrends: BookingTrend[];
}

export interface BookingTrend {
  date: string;
  count: number;
  revenue: number;
}

// Payment Types
export interface Payment {
  id: string;
  bookingId: string;
  booking?: Booking;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  reference: string;
  gateway: 'paystack' | 'stripe';
  gatewayReference?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter and Search Types
export interface BookingFilters {
  status?: BookingStatus[];
  serviceType?: ServiceType[];
  urgency?: UrgencyLevel[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  paymentStatus?: PaymentStatus[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Form Types
export interface BookingUpdateRequest {
  status?: BookingStatus;
  urgency?: UrgencyLevel;
  notes?: string;
  totalAmount?: number;
}

export interface PaymentVerificationRequest {
  reference: string;
  gateway: 'paystack' | 'stripe';
}

// Notification Types
export interface AdminNotification {
  id: string;
  type: 'booking_created' | 'payment_received' | 'booking_cancelled';
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  createdAt: string;
}

// API Response wrapper types
export interface BookingListResponse {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentListResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}