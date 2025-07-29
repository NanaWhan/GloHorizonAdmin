// GloHorizon Dashboard Service

import { apiClient } from '../client'
import { DashboardStats, BookingListItem } from '../config'

export class DashboardService {

    // Get dashboard overview stats
    static async getDashboardStats(): Promise<DashboardStats> {
        const response = await apiClient.get<DashboardStats>('/admin/dashboard')

        if (!response.data) {
            throw new Error('Failed to fetch dashboard stats')
        }

        return response.data
    }

    // Get recent bookings for dashboard
    static async getRecentBookings(limit: number = 10): Promise<BookingListItem[]> {
        const response = await apiClient.get<BookingListItem[]>(`/admin/bookings?pageSize=${limit}&sortBy=createdAt&sortOrder=desc`)
        return response.data || []
    }

    // Get pending urgent bookings
    static async getUrgentBookings(): Promise<BookingListItem[]> {
        const response = await apiClient.get<BookingListItem[]>('/admin/bookings?urgency=2,3&status=1,2')
        return response.data || []
    }

    // Get booking stats for charts
    static async getBookingTrends(period: 'week' | 'month' | 'year' = 'month'): Promise<{
        labels: string[]
        data: number[]
    }> {
        // This would be implemented based on your API
        // For now, returning mock data structure
        const now = new Date()
        const labels: string[] = []
        const data: number[] = []

        if (period === 'week') {
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now)
                date.setDate(date.getDate() - i)
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
                data.push(Math.floor(Math.random() * 10) + 1) // Mock data
            }
        } else if (period === 'month') {
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now)
                date.setDate(date.getDate() - i)
                labels.push(date.getDate().toString())
                data.push(Math.floor(Math.random() * 5) + 1) // Mock data
            }
        }

        return { labels, data }
    }

    // Get revenue statistics
    static async getRevenueStats(): Promise<{
        total: number
        thisMonth: number
        lastMonth: number
        growth: number
    }> {
        // This would be implemented based on your API
        // For now, calculating from bookings
        try {
            const response = await apiClient.get<BookingListItem[]>('/admin/bookings?status=8') // Completed bookings
            const bookings = response.data || []

            const now = new Date()
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

            const total = bookings
                .filter(b => b.finalPrice)
                .reduce((sum, b) => sum + (b.finalPrice || 0), 0)

            const thisMonthRevenue = bookings
                .filter(b => b.finalPrice && new Date(b.createdAt) >= thisMonth)
                .reduce((sum, b) => sum + (b.finalPrice || 0), 0)

            const lastMonthRevenue = bookings
                .filter(b => {
                    const bookingDate = new Date(b.createdAt)
                    return b.finalPrice && bookingDate >= lastMonth && bookingDate < thisMonth
                })
                .reduce((sum, b) => sum + (b.finalPrice || 0), 0)

            const growth = lastMonthRevenue > 0
                ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
                : 0

            return {
                total,
                thisMonth: thisMonthRevenue,
                lastMonth: lastMonthRevenue,
                growth
            }
        } catch (error) {
            return { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 }
        }
    }

    // Get service type breakdown
    static async getServiceTypeStats(): Promise<{
        [serviceType: number]: number
    }> {
        try {
            const response = await apiClient.get<BookingListItem[]>('/admin/bookings')
            const bookings = response.data || []

            const stats: { [key: number]: number } = {}
            bookings.forEach(booking => {
                stats[booking.serviceType] = (stats[booking.serviceType] || 0) + 1
            })

            return stats
        } catch (error) {
            return {}
        }
    }
} 