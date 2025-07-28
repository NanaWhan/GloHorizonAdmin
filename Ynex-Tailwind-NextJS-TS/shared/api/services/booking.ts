// GloHorizon Booking Service

import { apiClient } from '../client';
import { API_CONFIG } from '../config';
import { 
  Booking, 
  BookingListResponse, 
  BookingFilters, 
  PaginationParams, 
  BookingUpdateRequest,
  BookingStatus 
} from '../types';

class BookingService {

  // Get all bookings with filters and pagination
  async getBookings(
    filters: BookingFilters = {}, 
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<BookingListResponse> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());
      
      if (pagination.sortBy) {
        queryParams.append('sortBy', pagination.sortBy);
        queryParams.append('sortOrder', pagination.sortOrder || 'desc');
      }

      // Add filters
      if (filters.status && filters.status.length > 0) {
        queryParams.append('status', filters.status.join(','));
      }
      
      if (filters.serviceType && filters.serviceType.length > 0) {
        queryParams.append('serviceType', filters.serviceType.join(','));
      }
      
      if (filters.urgency && filters.urgency.length > 0) {
        queryParams.append('urgency', filters.urgency.join(','));
      }
      
      if (filters.paymentStatus && filters.paymentStatus.length > 0) {
        queryParams.append('paymentStatus', filters.paymentStatus.join(','));
      }
      
      if (filters.dateFrom) {
        queryParams.append('dateFrom', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        queryParams.append('dateTo', filters.dateTo);
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      const endpoint = `${API_CONFIG.ENDPOINTS.BOOKINGS.LIST}?${queryParams.toString()}`;
      const response = await apiClient.get<BookingListResponse>(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch bookings');
    } catch (error) {
      console.error('Get bookings error:', error);
      throw error;
    }
  }

  // Get single booking by ID
  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await apiClient.get<Booking>(
        API_CONFIG.ENDPOINTS.BOOKINGS.DETAILS,
        { id }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch booking details');
    } catch (error) {
      console.error('Get booking by ID error:', error);
      throw error;
    }
  }

  // Create new booking
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    try {
      const response = await apiClient.post<Booking>(
        API_CONFIG.ENDPOINTS.BOOKINGS.CREATE,
        bookingData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to create booking');
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  }

  // Update booking
  async updateBooking(id: string, updates: BookingUpdateRequest): Promise<Booking> {
    try {
      const response = await apiClient.put<Booking>(
        API_CONFIG.ENDPOINTS.BOOKINGS.UPDATE,
        updates,
        { id }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to update booking');
    } catch (error) {
      console.error('Update booking error:', error);
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    try {
      const response = await apiClient.patch<Booking>(
        API_CONFIG.ENDPOINTS.BOOKINGS.STATUS_UPDATE,
        { status, notes },
        { id }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to update booking status');
    } catch (error) {
      console.error('Update booking status error:', error);
      throw error;
    }
  }

  // Delete booking
  async deleteBooking(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(
        API_CONFIG.ENDPOINTS.BOOKINGS.DELETE,
        { id }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Delete booking error:', error);
      throw error;
    }
  }

  // Get recent bookings (for dashboard)
  async getRecentBookings(limit: number = 5): Promise<Booking[]> {
    try {
      const response = await apiClient.get<Booking[]>(
        API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_BOOKINGS,
        {},
        { limit: limit.toString() }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch recent bookings');
    } catch (error) {
      console.error('Get recent bookings error:', error);
      throw error;
    }
  }

  // Get booking statistics
  async getBookingStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const response = await apiClient.get<{
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
      }>(API_CONFIG.ENDPOINTS.DASHBOARD.STATS);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch booking statistics');
    } catch (error) {
      console.error('Get booking stats error:', error);
      throw error;
    }
  }

  // Export bookings to CSV
  async exportBookings(filters: BookingFilters = {}): Promise<Blob> {
    try {
      // Build query parameters for export
      const queryParams = new URLSearchParams();
      
      if (filters.status && filters.status.length > 0) {
        queryParams.append('status', filters.status.join(','));
      }
      
      if (filters.dateFrom) {
        queryParams.append('dateFrom', filters.dateFrom);
      }
      
      if (filters.dateTo) {
        queryParams.append('dateTo', filters.dateTo);
      }

      const endpoint = `${API_CONFIG.ENDPOINTS.BOOKINGS.LIST}/export?${queryParams.toString()}`;
      
      // Make request for CSV file
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('glohorizon_access_token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export bookings');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export bookings error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const bookingService = new BookingService();
export default bookingService;