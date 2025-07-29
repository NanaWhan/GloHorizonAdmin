// GloHorizon Booking API Services

import { apiClient } from '../client'
import {
    BookingListItem,
    BookingDetail,
    StatusUpdateRequest,
    PricingUpdateRequest,
    PaymentLinkResponse,
    BookingFilters
} from '../config'

export class BookingService {

    // Get all bookings with filters
    static async getBookings(filters: BookingFilters = {}): Promise<BookingListItem[]> {
        const params = new URLSearchParams()

        if (filters.status?.length) {
            filters.status.forEach(s => params.append('status', s.toString()))
        }
        if (filters.serviceType?.length) {
            filters.serviceType.forEach(s => params.append('serviceType', s.toString()))
        }
        if (filters.urgency?.length) {
            filters.urgency.forEach(u => params.append('urgency', u.toString()))
        }
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
        if (filters.dateTo) params.append('dateTo', filters.dateTo)
        if (filters.search) params.append('search', filters.search)
        if (filters.page) params.append('page', filters.page.toString())
        if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())

        const queryString = params.toString()
        const url = `/admin/bookings${queryString ? `?${queryString}` : ''}`

        const response = await apiClient.get<BookingListItem[]>(url)
        return response.data || []
    }

    // Get single booking details
    static async getBookingDetail(id: number): Promise<BookingDetail> {
        const response = await apiClient.get<BookingDetail>(`/admin/bookings/${id}`)
        if (!response.data) {
            throw new Error('Booking not found')
        }
        return response.data
    }

    // Update booking status
    static async updateBookingStatus(id: number, data: StatusUpdateRequest): Promise<void> {
        await apiClient.put(`/admin/bookings/${id}/status`, data)
    }

    // Update booking pricing
    static async updateBookingPricing(id: number, data: PricingUpdateRequest): Promise<void> {
        await apiClient.put(`/admin/bookings/${id}/pricing`, data)
    }

    // Add admin note to booking
    static async addBookingNote(id: number, note: string): Promise<void> {
        await apiClient.post(`/admin/bookings/${id}/notes`, { note })
    }

    // Generate payment link for booking
    static async generatePaymentLink(id: number): Promise<PaymentLinkResponse> {
        const response = await apiClient.post<PaymentLinkResponse>(`/admin/bookings/${id}/payment-link`)
        if (!response.data) {
            throw new Error('Failed to generate payment link')
        }
        return response.data
    }

    // Verify payment status
    static async verifyPayment(reference: string): Promise<any> {
        const response = await apiClient.post(`/payment/verify/${reference}`)
        return response.data
    }

    // Get booking statistics (for dashboard)
    static async getBookingStats(): Promise<{
        total: number
        pending: number
        completed: number
        revenue: number
    }> {
        // This would be implemented based on your API
        // For now, calculating from bookings list
        const bookings = await this.getBookings()

        return {
            total: bookings.length,
            pending: bookings.filter(b => [1, 2].includes(b.status)).length,
            completed: bookings.filter(b => b.status === 8).length,
            revenue: bookings
                .filter(b => b.finalPrice)
                .reduce((sum, b) => sum + (b.finalPrice || 0), 0)
        }
    }

    // Export bookings data
    static async exportBookings(filters: BookingFilters = {}): Promise<Blob> {
        const bookings = await this.getBookings(filters)

        // Convert to CSV
        const headers = ['Reference', 'Service', 'Status', 'Customer', 'Price', 'Created']
        const rows = bookings.map(booking => [
            booking.referenceNumber,
            SERVICE_TYPES[booking.serviceType as keyof typeof SERVICE_TYPES]?.name || 'Unknown',
            BOOKING_STATUSES[booking.status as keyof typeof BOOKING_STATUSES]?.name || 'Unknown',
            booking.user?.fullName || 'N/A',
            booking.finalPrice ? `${booking.currency} ${booking.finalPrice}` : 'Pending',
            new Date(booking.createdAt).toLocaleDateString()
        ])

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n')

        return new Blob([csvContent], { type: 'text/csv' })
    }
}

// Re-export types for convenience
export * from '../config'
export { SERVICE_TYPES, BOOKING_STATUSES, URGENCY_LEVELS } from '../../types/glohorizon' 