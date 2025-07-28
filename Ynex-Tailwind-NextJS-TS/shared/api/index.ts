// GloHorizon API - Main Export File

// Configuration
export { API_CONFIG, REQUEST_TIMEOUT, TOKEN_KEYS } from './config';
export type { ApiResponse, PaginatedResponse } from './config';

// API Client
export { apiClient } from './client';

// Types
export * from './types';

// Services
export { authService } from './services/auth';
export { bookingService } from './services/booking';
export { paymentService } from './services/payment';

// Service instances for convenience
import { authService } from './services/auth';
import { bookingService } from './services/booking';
import { paymentService } from './services/payment';

export const gloHorizonApi = {
  auth: authService,
  bookings: bookingService,
  payments: paymentService
};

export default gloHorizonApi;