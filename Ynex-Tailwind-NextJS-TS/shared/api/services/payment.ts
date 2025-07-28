// GloHorizon Payment Service

import { apiClient } from '../client';
import { API_CONFIG } from '../config';
import { 
  Payment, 
  PaymentListResponse, 
  PaymentVerificationRequest,
  PaginationParams 
} from '../types';

class PaymentService {

  // Get all payments with pagination
  async getPayments(
    pagination: PaginationParams = { page: 1, limit: 10 }
  ): Promise<PaymentListResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());
      
      if (pagination.sortBy) {
        queryParams.append('sortBy', pagination.sortBy);
        queryParams.append('sortOrder', pagination.sortOrder || 'desc');
      }

      const endpoint = `${API_CONFIG.ENDPOINTS.PAYMENTS.LIST}?${queryParams.toString()}`;
      const response = await apiClient.get<PaymentListResponse>(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch payments');
    } catch (error) {
      console.error('Get payments error:', error);
      throw error;
    }
  }

  // Get single payment by ID
  async getPaymentById(id: string): Promise<Payment> {
    try {
      const response = await apiClient.get<Payment>(
        API_CONFIG.ENDPOINTS.PAYMENTS.LIST + `/${id}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch payment details');
    } catch (error) {
      console.error('Get payment by ID error:', error);
      throw error;
    }
  }

  // Verify payment automatically
  async verifyPayment(id: string): Promise<Payment> {
    try {
      const response = await apiClient.post<Payment>(
        API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY,
        {},
        { id }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to verify payment');
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  // Manual payment verification
  async manualVerifyPayment(
    id: string, 
    verificationData: PaymentVerificationRequest
  ): Promise<Payment> {
    try {
      const response = await apiClient.post<Payment>(
        API_CONFIG.ENDPOINTS.PAYMENTS.MANUAL_VERIFY,
        verificationData,
        { id }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to manually verify payment');
    } catch (error) {
      console.error('Manual verify payment error:', error);
      throw error;
    }
  }

  // Get payments for a specific booking
  async getPaymentsByBookingId(bookingId: string): Promise<Payment[]> {
    try {
      const response = await apiClient.get<Payment[]>(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.LIST}/booking/${bookingId}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch booking payments');
    } catch (error) {
      console.error('Get payments by booking ID error:', error);
      throw error;
    }
  }

  // Get pending payments (for admin dashboard)
  async getPendingPayments(): Promise<Payment[]> {
    try {
      const response = await apiClient.get<Payment[]>(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.LIST}/pending`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch pending payments');
    } catch (error) {
      console.error('Get pending payments error:', error);
      throw error;
    }
  }

  // Get payment statistics
  async getPaymentStats(): Promise<{
    totalRevenue: number;
    pendingAmount: number;
    completedPayments: number;
    failedPayments: number;
    refundedAmount: number;
  }> {
    try {
      const response = await apiClient.get<{
        totalRevenue: number;
        pendingAmount: number;
        completedPayments: number;
        failedPayments: number;
        refundedAmount: number;
      }>(`${API_CONFIG.ENDPOINTS.PAYMENTS.LIST}/stats`);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch payment statistics');
    } catch (error) {
      console.error('Get payment stats error:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(paymentId: string, amount?: number, reason?: string): Promise<Payment> {
    try {
      const response = await apiClient.post<Payment>(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.LIST}/${paymentId}/refund`,
        { amount, reason }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to process refund');
    } catch (error) {
      console.error('Process refund error:', error);
      throw error;
    }
  }

  // Retry failed payment
  async retryPayment(paymentId: string): Promise<Payment> {
    try {
      const response = await apiClient.post<Payment>(
        `${API_CONFIG.ENDPOINTS.PAYMENTS.LIST}/${paymentId}/retry`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to retry payment');
    } catch (error) {
      console.error('Retry payment error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;